"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface MenuHeaderProps {
  className?: string;
}

export function MenuHeader({ className }: MenuHeaderProps) {
  return (
    <header className={cn("text-center py-2 px-4", className)}>
      <div className="flex items-center justify-center">
        <Image
          src="/mandl-logo.png"
          alt="M & L Motors Cafe"
          width={288}
          height={288}
          priority
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </header>
  );
}
