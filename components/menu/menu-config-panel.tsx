"use client";

import { cn } from "@/lib/utils";
import { MenuConfig } from "@/lib/menu-config";
import { Settings, X } from "lucide-react";
import { useState } from "react";

interface MenuConfigPanelProps {
  config: MenuConfig;
  onConfigChange: (config: MenuConfig) => void;
  className?: string;
}

export function MenuConfigPanel({
  config,
  onConfigChange,
  className,
}: MenuConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105",
          className
        )}
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Panel Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-card border-l border-border shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl text-foreground">Menu Settings</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-sm hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Items Per Page */}
            <div>
              <label className="block font-sans text-sm text-foreground mb-2">
                Items Per Page
              </label>
              <div className="flex items-center gap-2">
                {[4, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => onConfigChange({ ...config, itemsPerPage: num })}
                    className={cn(
                      "px-4 py-2 rounded-sm border transition-colors font-sans text-sm",
                      config.itemsPerPage === num
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Rotate */}
            <div>
              <label className="block font-sans text-sm text-foreground mb-2">
                Auto-Rotate Pages
              </label>
              <div className="flex items-center gap-2">
                {[
                  { value: 0, label: "Off" },
                  { value: 10000, label: "10s" },
                  { value: 15000, label: "15s" },
                  { value: 30000, label: "30s" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onConfigChange({ ...config, autoRotateInterval: option.value })}
                    className={cn(
                      "px-4 py-2 rounded-sm border transition-colors font-sans text-sm",
                      config.autoRotateInterval === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Show Prices */}
            <div>
              <label className="block font-sans text-sm text-foreground mb-2">
                Show Prices
              </label>
              <button
                onClick={() => onConfigChange({ ...config, showPrices: !config.showPrices })}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors",
                  config.showPrices ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-card transition-transform shadow-sm",
                    config.showPrices ? "translate-x-7" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {/* Currency */}
            <div>
              <label className="block font-sans text-sm text-foreground mb-2">
                Currency Symbol
              </label>
              <div className="flex items-center gap-2">
                {["$", "€", "£", "¥"].map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => onConfigChange({ ...config, currency: symbol })}
                    className={cn(
                      "w-10 h-10 rounded-sm border transition-colors font-serif text-lg",
                      config.currency === symbol
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-10 pt-6 border-t border-border">
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              These settings control how the menu is displayed. Changes are applied immediately.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
