"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MenuPaginationProps {
  currentPage: number;
  totalPages: number;
  pageLabels: string[];
  onPageChange: (page: number) => void;
  className?: string;
}

export function MenuPagination({
  currentPage,
  totalPages,
  pageLabels,
  onPageChange,
  className,
}: MenuPaginationProps) {
  const canGoBack = currentPage > 0;
  const canGoForward = currentPage < totalPages - 1;

  return (
    <div className={cn("flex items-center justify-center gap-2 py-[1px] px-[1px]", className)}>
      {/* Previous Button */}
      <button
        onClick={() => canGoBack && onPageChange(currentPage - 1)}
        disabled={!canGoBack}
        className={cn(
          "p-2 rounded-sm border border-border transition-colors",
          canGoBack
            ? "hover:bg-card hover:border-primary/30 text-foreground"
            : "text-muted-foreground/50 cursor-not-allowed"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Indicators */}
      <div className="flex items-center gap-1 px-4">
        {pageLabels.map((label, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            className={cn(
              "px-3 py-1.5 font-sans tracking-wide uppercase transition-all rounded-sm",
              index === currentPage
                ? "bg-primary text-primary-foreground text-base font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted text-xs"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => canGoForward && onPageChange(currentPage + 1)}
        disabled={!canGoForward}
        className={cn(
          "p-2 rounded-sm border border-border transition-colors",
          canGoForward
            ? "hover:bg-card hover:border-primary/30 text-foreground"
            : "text-muted-foreground/50 cursor-not-allowed"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
