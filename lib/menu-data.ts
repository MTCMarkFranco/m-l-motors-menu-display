export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  featured?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
}

export const categories: MenuCategory[] = [
  { id: "featured", name: "Boissons Vedettes", description: "Our signature creations" },
  { id: "hot-drinks", name: "Boissons Chaudes", description: "Hot drinks to warm your soul" },
  { id: "cold-drinks", name: "Boissons Froides", description: "Refreshing cold beverages" },
  { id: "yummies", name: "Gourmandises", description: "Sweet treats and pastries" },
];

export const menuItems: MenuItem[] = [
  // Featured Drinks
  {
    id: "1",
    name: "Lavande Latte",
    description: "Espresso with steamed milk infused with Provençal lavender and a touch of vanilla",
    price: 6.50,
    category: "featured",
    featured: true,
  },
  {
    id: "2",
    name: "Rose Cardamom Cappuccino",
    description: "Velvety cappuccino with rose water, cardamom, and delicate rose petals",
    price: 7.00,
    category: "featured",
    featured: true,
  },
  {
    id: "3",
    name: "Honey Chamomile Cold Brew",
    description: "Smooth cold brew steeped with chamomile and sweetened with wildflower honey",
    price: 6.00,
    category: "featured",
    featured: true,
  },
  {
    id: "4",
    name: "Caramel Beurre Salé",
    description: "Rich espresso with Breton salted caramel and steamed oat milk",
    price: 6.75,
    category: "featured",
    featured: true,
  },
  
  // Hot Drinks
  {
    id: "5",
    name: "Espresso",
    description: "Single origin, perfectly extracted",
    price: 3.50,
    category: "hot-drinks",
  },
  {
    id: "6",
    name: "Double Espresso",
    description: "For the true coffee lover",
    price: 4.50,
    category: "hot-drinks",
  },
  {
    id: "7",
    name: "Americano",
    description: "Espresso with hot water",
    price: 4.00,
    category: "hot-drinks",
  },
  {
    id: "8",
    name: "Café Crème",
    description: "Our signature creamy coffee",
    price: 5.00,
    category: "hot-drinks",
  },
  {
    id: "9",
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and foam",
    price: 5.50,
    category: "hot-drinks",
  },
  {
    id: "10",
    name: "Café au Lait",
    description: "French pressed coffee with warm milk",
    price: 5.00,
    category: "hot-drinks",
  },
  {
    id: "11",
    name: "Mocha",
    description: "Espresso with Belgian chocolate and steamed milk",
    price: 6.00,
    category: "hot-drinks",
  },
  {
    id: "12",
    name: "Chocolat Chaud",
    description: "Rich hot chocolate with whipped cream",
    price: 5.50,
    category: "hot-drinks",
  },
  {
    id: "13",
    name: "Earl Grey Impérial",
    description: "Classic bergamot blend with cornflower petals",
    price: 4.50,
    category: "hot-drinks",
  },
  {
    id: "14",
    name: "Chai Épicé",
    description: "Black tea with warming spices and steamed milk",
    price: 5.00,
    category: "hot-drinks",
  },
  {
    id: "15",
    name: "Thé Vert Matcha",
    description: "Ceremonial grade whisked matcha latte",
    price: 5.50,
    category: "hot-drinks",
  },
  {
    id: "16",
    name: "Verveine Infusion",
    description: "Lemon verbena, naturally calming",
    price: 4.00,
    category: "hot-drinks",
  },
  
  // Cold Drinks
  {
    id: "17",
    name: "Cold Brew",
    description: "Smooth, slow-steeped for 18 hours",
    price: 5.00,
    category: "cold-drinks",
  },
  {
    id: "18",
    name: "Iced Latte",
    description: "Espresso with cold milk over ice",
    price: 5.50,
    category: "cold-drinks",
  },
  {
    id: "19",
    name: "Iced Americano",
    description: "Espresso with cold water over ice",
    price: 4.50,
    category: "cold-drinks",
  },
  {
    id: "20",
    name: "Affogato",
    description: "Vanilla gelato drowned in espresso",
    price: 6.50,
    category: "cold-drinks",
  },
  {
    id: "21",
    name: "Citron Pressé",
    description: "Fresh squeezed lemonade with sparkling water",
    price: 4.50,
    category: "cold-drinks",
  },
  {
    id: "22",
    name: "Thé Glacé Pêche",
    description: "Peach iced tea with mint",
    price: 4.50,
    category: "cold-drinks",
  },
  {
    id: "23",
    name: "Menthe Frappée",
    description: "Blended mint with crushed ice",
    price: 5.00,
    category: "cold-drinks",
  },
  {
    id: "24",
    name: "Smoothie Fruits Rouges",
    description: "Mixed berries, banana, and honey",
    price: 6.50,
    category: "cold-drinks",
  },
  {
    id: "25",
    name: "Limonade Lavande",
    description: "House lemonade infused with lavender",
    price: 5.00,
    category: "cold-drinks",
  },
  {
    id: "26",
    name: "Orangina Maison",
    description: "Fresh orange juice with sparkling water",
    price: 4.50,
    category: "cold-drinks",
  },
  
  // Yummies (Pastries & Treats)
  {
    id: "27",
    name: "Croissant au Beurre",
    description: "Classic butter croissant, flaky and golden",
    price: 4.50,
    category: "yummies",
  },
  {
    id: "28",
    name: "Pain au Chocolat",
    description: "Buttery pastry with dark chocolate batons",
    price: 5.00,
    category: "yummies",
  },
  {
    id: "29",
    name: "Tarte aux Fruits",
    description: "Seasonal fruit tart with crème pâtissière",
    price: 6.50,
    category: "yummies",
  },
  {
    id: "30",
    name: "Éclair au Café",
    description: "Choux pastry with coffee cream and glaze",
    price: 5.50,
    category: "yummies",
  },
  {
    id: "31",
    name: "Madeleine",
    description: "Lemon-scented shell cakes, three pieces",
    price: 4.00,
    category: "yummies",
  },
  {
    id: "32",
    name: "Canelé",
    description: "Bordeaux specialty with rum and vanilla",
    price: 4.50,
    category: "yummies",
  },
  {
    id: "33",
    name: "Paris-Brest",
    description: "Praline cream in choux ring",
    price: 7.00,
    category: "yummies",
  },
  {
    id: "34",
    name: "Kouign-Amann",
    description: "Breton caramelized butter pastry",
    price: 5.50,
    category: "yummies",
  },
  {
    id: "35",
    name: "Macaron Assortis",
    description: "Selection of three macarons",
    price: 6.00,
    category: "yummies",
  },
  {
    id: "36",
    name: "Tarte au Citron",
    description: "Tangy lemon tart with meringue",
    price: 6.00,
    category: "yummies",
  },
  {
    id: "37",
    name: "Palmier",
    description: "Caramelized puff pastry heart",
    price: 3.50,
    category: "yummies",
  },
  {
    id: "38",
    name: "Financier",
    description: "Almond butter cakes, two pieces",
    price: 4.50,
    category: "yummies",
  },
];
