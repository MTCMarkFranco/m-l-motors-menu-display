import { NextResponse } from "next/server";
import { getSquareClient } from "@/lib/square";
import type { MenuItem, MenuCategory } from "@/lib/menu-data";

const KIOSK_MENU_NAME = "Kiosk Menu";

// Cache the menu data for 60 seconds to avoid excessive API calls
let cachedData: { items: MenuItem[]; categories: MenuCategory[] } | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 60 seconds

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getVariationDescription(variation: any): string | undefined {
  const customAttributes = variation?.customAttributeValues;
  if (!customAttributes || typeof customAttributes !== "object") {
    return undefined;
  }

  for (const [key, rawValue] of Object.entries(customAttributes)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = rawValue as any;
    const label = [
      key,
      value?.name,
      value?.customAttributeDefinitionName,
      value?.definitionName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!label.includes("description")) continue;

    const text = typeof value?.stringValue === "string" ? value.stringValue.trim() : "";
    if (text) return text;
  }

  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getItemSortOrder(itemData: any, categoryId: string, fallback: number): number {
  const categoryRefs = Array.isArray(itemData?.categories) ? itemData.categories : [];
  for (const ref of categoryRefs) {
    if (ref?.id !== categoryId) continue;
    const ordinal = Number(ref?.ordinal);
    if (Number.isFinite(ordinal)) return ordinal;
  }

  const directOrdinal = Number(itemData?.ordinal);
  if (Number.isFinite(directOrdinal)) return directOrdinal;

  return fallback;
}

export async function GET() {
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json(cachedData);
  }

  try {
    const client = getSquareClient();

    // 1. Fetch all categories to find the Kiosk Menu and its children
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allCategories: any[] = [];
    const catResponse = await client.catalog.list({ types: "CATEGORY" });
    for await (const obj of catResponse) {
      allCategories.push(obj);
    }

    // 2. Find the "Kiosk Menu" top-level menu category
    const kioskMenu = allCategories.find(
      (c) =>
        c.categoryData?.name === KIOSK_MENU_NAME &&
        c.categoryData?.categoryType === "MENU_CATEGORY" &&
        c.categoryData?.isTopLevel === true
    );

    if (!kioskMenu) {
      console.error("Kiosk Menu not found in Square catalog");
      return NextResponse.json(
        { error: "Kiosk Menu not found" },
        { status: 404 }
      );
    }

    // 3. Get child categories of the Kiosk Menu (these become our page names)
    const kioskChildren = allCategories
      .filter(
        (c) =>
          c.categoryData?.parentCategory?.id === kioskMenu.id &&
          c.categoryData?.categoryType === "MENU_CATEGORY"
      )
      .sort((a, b) => {
        // Sort by ordinal (more negative = first)
        const ordA = Number(a.categoryData?.parentCategory?.ordinal ?? 0);
        const ordB = Number(b.categoryData?.parentCategory?.ordinal ?? 0);
        return ordA - ordB;
      });

    const categories: MenuCategory[] = kioskChildren.map((cat) => ({
      id: cat.id as string,
      name: cat.categoryData?.name ?? "Uncategorized",
      description: cat.categoryData?.description ?? undefined,
      // Store image ID temporarily; will resolve to URL below
      imageUrl: cat.categoryData?.imageIds?.[0] ?? undefined,
    }));

    // Collect category image IDs for batch retrieval
    const imageIdsToFetch: string[] = categories
      .map((c) => c.imageUrl)
      .filter((id): id is string => !!id);

    // 4. For each child category, search for its items
    const allItems: MenuItem[] = [];

    for (const cat of kioskChildren) {
      const catId = cat.id as string;
      const result = await client.catalog.searchItems({
        categoryIds: [catId],
        limit: 100,
      });

      const items = result.items || [];
      for (const [itemIndex, item] of items.entries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (item as any).itemData;
        const sortOrder = getItemSortOrder(data, catId, itemIndex);

        // Build variations list from Square item variations
        const squareVariations = data?.variations || [];
        const variations: Array<{ name: string; price: number; description?: string }> = [];
        for (const v of squareVariations) {
          const vd = v.itemVariationData;
          const amt = vd?.priceMoney?.amount;
          const variationDescription = getVariationDescription(v);
          variations.push({
            name: vd?.name ?? "Regular",
            price: amt !== undefined ? Number(amt) / 100 : 0,
            ...(variationDescription ? { description: variationDescription } : {}),
          });
        }

        // Use the first variation's price as the base price
        const price = variations.length > 0 ? variations[0].price : 0;

        allItems.push({
          id: item.id as string,
          name: data?.name ?? "Unknown Item",
          description: data?.description ?? "",
          price,
          sortOrder,
          category: catId,
          // Only include variations if there are multiple (single = just show the price)
          ...(variations.length > 1 ? { variations } : {}),
        });
      }
    }

    // 5. Batch-fetch all image objects to resolve image IDs to URLs
    const imageUrlMap = new Map<string, string>();
    const uniqueImageIds = [...new Set(imageIdsToFetch)];
    if (uniqueImageIds.length > 0) {
      try {
        const batchResponse = await client.catalog.batchGet({
          objectIds: uniqueImageIds,
        });
        const objects = batchResponse.objects || [];
        for (const obj of objects) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const imgData = (obj as any).imageData;
          if (imgData?.url) {
            imageUrlMap.set(obj.id as string, imgData.url as string);
          }
        }
      } catch (imgErr) {
        console.error("Failed to fetch images:", imgErr);
      }
    }

    // Resolve image IDs to URLs on each category
    for (const cat of categories) {
      if (cat.imageUrl && imageUrlMap.has(cat.imageUrl)) {
        cat.imageUrl = imageUrlMap.get(cat.imageUrl)!;
      } else {
        delete cat.imageUrl;
      }
    }

    const resultData = { items: allItems, categories };

    // Update cache
    cachedData = resultData;
    cacheTimestamp = now;

    return NextResponse.json(resultData);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch menu";
    console.error("Square Catalog API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
