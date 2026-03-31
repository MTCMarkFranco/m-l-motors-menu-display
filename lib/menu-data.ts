export interface ItemVariation {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  featured?: boolean;
  variations?: ItemVariation[];
  imageUrl?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

// Fallback data used when Square API is not configured
export const fallbackCategories: MenuCategory[] = [];

export const fallbackMenuItems: MenuItem[] = [];
