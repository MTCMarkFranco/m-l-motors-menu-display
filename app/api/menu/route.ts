import { NextResponse } from "next/server";
import { getSquareClient } from "@/lib/square";
import type { MenuItem, MenuCategory } from "@/lib/menu-data";

const KIOSK_MENU_NAME = "Kiosk Menu";

// Cache the menu data for 60 seconds to avoid excessive API calls
let cachedData: { items: MenuItem[]; categories: MenuCategory[] } | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 60 seconds

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
    }));

    // 4. For each child category, search for its items
    const allItems: MenuItem[] = [];

    for (const cat of kioskChildren) {
      const catId = cat.id as string;
      const result = await client.catalog.searchItems({
        categoryIds: [catId],
        limit: 100,
      });

      const items = result.items || [];
      for (const item of items) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (item as any).itemData;

        // Build variations list from Square item variations
        const squareVariations = data?.variations || [];
        const variations: Array<{ name: string; price: number }> = [];
        for (const v of squareVariations) {
          const vd = v.itemVariationData;
          const amt = vd?.priceMoney?.amount;
          variations.push({
            name: vd?.name ?? "Regular",
            price: amt !== undefined ? Number(amt) / 100 : 0,
          });
        }

        // Use the first variation's price as the base price
        const price = variations.length > 0 ? variations[0].price : 0;

        allItems.push({
          id: item.id as string,
          name: data?.name ?? "Unknown Item",
          description: data?.description ?? "",
          price,
          category: catId,
          // Only include variations if there are multiple (single = just show the price)
          ...(variations.length > 1 ? { variations } : {}),
        });
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
