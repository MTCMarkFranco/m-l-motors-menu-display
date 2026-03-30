"use client";

import { cn } from "@/lib/utils";

interface MenuHeaderProps {
  className?: string;
}

export function MenuHeader({ className }: MenuHeaderProps) {
  return (
    <header className={cn("text-center py-8 px-4 border-b border-border", className)}>
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="h-px w-16 bg-primary/30" />
        <svg
          className="w-8 h-8 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 2C13.5 4 15 6 15 9C15 12 13.5 14 12 14C10.5 14 9 12 9 9C9 6 10.5 4 12 2Z" />
          <path d="M12 14V22" />
          <path d="M9 18H15" />
        </svg>
        <div className="h-px w-16 bg-primary/30" />
      </div>
      <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-foreground">
        La Petite Boulangerie
      </h1>
      <p className="font-sans text-muted-foreground mt-2 text-sm tracking-widest uppercase">
        Café & Pâtisserie
      </p>
    </header>
  );
}
