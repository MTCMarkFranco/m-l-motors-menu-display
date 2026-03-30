"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { menuItems, categories, MenuItem, MenuCategory } from "@/lib/menu-data";
import { MenuConfig, defaultMenuConfig } from "@/lib/menu-config";
import { MenuHeader } from "./menu-header";
import { FeaturedDrinks } from "./featured-drinks";
import { MenuCategoryPage } from "./menu-category-page";
import { MenuPagination } from "./menu-pagination";
import { MenuConfigPanel } from "./menu-config-panel";

interface PageData {
  type: "featured" | "category";
  label: string;
  category?: MenuCategory;
  items: MenuItem[];
}

const PAGE_ORDER = ["featured", "hot-drinks", "cold-drinks", "yummies"];
const PAGE_LABELS = ["Vedettes", "Chaudes", "Froides", "Gourmandises"];

export function CafeMenu() {
  const [config, setConfig] = useState<MenuConfig>(defaultMenuConfig);
  const [currentPage, setCurrentPage] = useState(0);

  // Build exactly 4 pages in the specified order
  const pages = useMemo(() => {
    const result: PageData[] = [];

    PAGE_ORDER.forEach((categoryId, index) => {
      const category = categories.find((c) => c.id === categoryId);
      const items = menuItems.filter((item) => item.category === categoryId);

      if (categoryId === "featured") {
        result.push({
          type: "featured",
          label: PAGE_LABELS[index],
          items: items.slice(0, config.itemsPerPage),
        });
      } else if (category) {
        result.push({
          type: "category",
          label: PAGE_LABELS[index],
          category,
          items: items.slice(0, config.itemsPerPage),
        });
      }
    });

    return result;
  }, [config.itemsPerPage]);

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

      <div className="relative z-10">
        <MenuHeader />

        {/* Current Page Content */}
        <main className="min-h-[60vh]">
          {currentPageData?.type === "featured" ? (
            <FeaturedDrinks
              items={currentPageData.items}
              config={config}
            />
          ) : currentPageData?.category ? (
            <MenuCategoryPage
              category={currentPageData.category}
              items={currentPageData.items}
              config={config}
            />
          ) : null}
        </main>

        {/* Pagination */}
        <MenuPagination
          currentPage={currentPage}
          totalPages={pages.length}
          pageLabels={pages.map((p) => p.label)}
          onPageChange={handlePageChange}
        />

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-border" />
            <svg
              className="w-6 h-6 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M12 2C13.5 4 15 6 15 9C15 12 13.5 14 12 14C10.5 14 9 12 9 9C9 6 10.5 4 12 2Z" />
              <path d="M12 14V22" />
              <path d="M9 18H15" />
            </svg>
            <div className="h-px w-12 bg-border" />
          </div>
          <p className="font-sans text-xs text-muted-foreground tracking-wide">
            Fresh ingredients sourced from local farms
          </p>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            Please inform us of any allergies
          </p>
        </footer>

        {/* Configuration Panel */}
        <MenuConfigPanel config={config} onConfigChange={setConfig} />
      </div>
    </div>
  );
}
