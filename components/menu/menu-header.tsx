"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface MenuHeaderProps {
  className?: string;
}

export function MenuHeader({ className }: MenuHeaderProps) {
  return (
    <header className={cn("text-center py-2 px-4 border-b border-border", className)}>
      <div className="flex items-center justify-center">
        <Image
          src="/mandl-logo.png"
          alt="M & L Motors Cafe"
          width={360}
          height={360}
          priority
        />
      </div>
    </header>
  );
}
