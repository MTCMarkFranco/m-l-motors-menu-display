"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { fallbackMenuItems, fallbackCategories, MenuItem, MenuCategory } from "@/lib/menu-data";
import { MenuConfig, defaultMenuConfig } from "@/lib/menu-config";
import { MenuHeader } from "./menu-header";
import { MenuCategoryPage } from "./menu-category-page";
import { MenuPagination } from "./menu-pagination";

interface PageData {
  label: string;
  category: MenuCategory;
  items: MenuItem[];
}

export function CafeMenu() {
  const [config] = useState<MenuConfig>(defaultMenuConfig);
  const [currentPage, setCurrentPage] = useState(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(fallbackMenuItems);
  const [categories, setCategories] = useState<MenuCategory[]>(fallbackCategories);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu data from Square API
  useEffect(() => {
    let cancelled = false;

    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        if (cancelled) return;

        if (data.items && data.items.length > 0) {
          setMenuItems(data.items);
          setCategories(data.categories);
          setCurrentPage(0); // Ensure first category is selected when data loads
        }
        // If API returns empty data, keep the fallback
      } catch {
        // On error, keep using fallback data — no action needed
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchMenu();
    return () => { cancelled = true; };
  }, []);

  // Build pages dynamically — one page per Kiosk Menu category
  const pages = useMemo(() => {
    const result: PageData[] = [];

    for (const category of categories) {
      const items = menuItems.filter((item) => item.category === category.id);
      if (items.length > 0) {
        result.push({
          type: "category",
          label: category.name,
          category,
          items: items.slice(0, config.itemsPerPage),
        });
      }
    }

    return result;
  }, [config.itemsPerPage, menuItems, categories]);

  // Auto-rotate pages infinitely every 10 seconds
  useEffect(() => {
    if (config.autoRotateInterval === 0) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length);
    }, config.autoRotateInterval);

    return () => clearInterval(timer);
  }, [config.autoRotateInterval, pages.length]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Reset to valid page if current page becomes invalid
  useEffect(() => {
    if (currentPage >= pages.length) {
      setCurrentPage(0);
    }
  }, [currentPage, pages.length]);

  const currentPageData = pages[currentPage];

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative wood texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vintage ornate border frame */}
      <div className="vintage-border-frame">
        <div className="vintage-border-corner vintage-border-corner-tl" />
        <div className="vintage-border-corner vintage-border-corner-tr" />
        <div className="vintage-border-corner vintage-border-corner-bl" />
        <div className="vintage-border-corner vintage-border-corner-br" />
        <div className="vintage-border-edge vintage-border-edge-top" />
        <div className="vintage-border-edge vintage-border-edge-bottom" />
        <div className="vintage-border-edge vintage-border-edge-left" />
        <div className="vintage-border-edge vintage-border-edge-right" />
      </div>

      <div className="relative z-10" style={{ padding: '0 40px' }}>
        <MenuHeader />

        {/* Pagination */}
        <MenuPagination
          currentPage={currentPage}
          totalPages={pages.length}
          pageLabels={pages.map((p) => p.label)}
          onPageChange={handlePageChange}
        />
        <div>&nbsp;</div>

        {/* Current Page Content */}
        <main className="min-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[40vh]">
              <p className="font-chalk text-2xl text-muted-foreground">Loading menu...</p>
            </div>
          ) : currentPageData?.category ? (
            <MenuCategoryPage
              category={currentPageData.category}
              items={currentPageData.items}
              config={config}
            />
          ) : (
            <div className="flex items-center justify-center h-[40vh]">
              <p className="font-chalk text-2xl text-muted-foreground">No menu items available</p>
            </div>
          )}
        </main>

        

      </div>

      {/* Fixed bottom allergy notice */}
      <div className="fixed bottom-8 left-0 right-0 z-0 bg-background/90 backdrop-blur-sm py-3 text-center border-t border-border/30">
        <p className="font-sans text-base font-bold text-muted-foreground">
          Please inform us of any allergies
        </p>
      </div>
    </div>
  );
}
