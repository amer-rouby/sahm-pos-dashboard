import { Order, Product } from './models';

export const initialOrders: Order[] = [
  {
    id: 'ORD-1042',
    customerName: 'Mona Ahmed',
    channel: 'walk-in',
    status: 'received',
    priority: 'rush',
    branch: 'Nasr City',
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    etaMinutes: 12,
    total: 286,
    allergyNotes: 'No sesame',
    items: [
      { productId: 'p-1', name: 'Classic Beef Burger', quantity: 2, price: 115 },
      { productId: 'p-8', name: 'Iced Lemon Mint', quantity: 2, price: 28 }
    ]
  },
  {
    id: 'ORD-1043',
    customerName: 'Youssef Ali',
    channel: 'delivery',
    status: 'preparing',
    priority: 'normal',
    branch: 'Heliopolis',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    etaMinutes: 22,
    total: 194,
    missingInfo: 'Apartment number',
    items: [
      { productId: 'p-3', name: 'Chicken Ranch Wrap', quantity: 1, price: 96 },
      { productId: 'p-6', name: 'Loaded Fries', quantity: 1, price: 62 }
    ]
  },
  {
    id: 'ORD-1044',
    customerName: 'Nada Samir',
    channel: 'online',
    status: 'ready',
    priority: 'normal',
    branch: 'Maadi',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    etaMinutes: 6,
    total: 148,
    items: [
      { productId: 'p-5', name: 'Falafel Slider Box', quantity: 1, price: 88 },
      { productId: 'p-9', name: 'Chocolate Pudding', quantity: 1, price: 60 }
    ]
  },
  {
    id: 'ORD-1045',
    customerName: 'Karim Hassan',
    channel: 'delivery',
    status: 'delivered',
    priority: 'delayed',
    branch: 'Nasr City',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    etaMinutes: -4,
    total: 352,
    items: [
      { productId: 'p-2', name: 'Smoked Mushroom Burger', quantity: 2, price: 128 },
      { productId: 'p-7', name: 'Crispy Onion Rings', quantity: 2, price: 48 }
    ]
  }
];

export const products: Product[] = [
  { id: 'p-1', name: 'Classic Beef Burger', category: 'Burgers', price: 115, tags: ['best seller', 'beef'], allergens: ['gluten', 'dairy'] },
  { id: 'p-2', name: 'Smoked Mushroom Burger', category: 'Burgers', price: 128, tags: ['vegetarian', 'smoky'], allergens: ['gluten', 'dairy'] },
  { id: 'p-3', name: 'Chicken Ranch Wrap', category: 'Burgers', price: 96, tags: ['chicken', 'quick'], allergens: ['gluten', 'egg'] },
  { id: 'p-4', name: 'Breakfast Egg Muffin', category: 'Breakfast', price: 72, tags: ['morning', 'quick'], allergens: ['egg', 'gluten'] },
  { id: 'p-5', name: 'Falafel Slider Box', category: 'Breakfast', price: 88, tags: ['vegan', 'sharing'], allergens: ['sesame'] },
  { id: 'p-6', name: 'Loaded Fries', category: 'Sides', price: 62, tags: ['upsell', 'cheese'], allergens: ['dairy'] },
  { id: 'p-7', name: 'Crispy Onion Rings', category: 'Sides', price: 48, tags: ['side', 'crunchy'], allergens: ['gluten'] },
  { id: 'p-8', name: 'Iced Lemon Mint', category: 'Drinks', price: 28, tags: ['cold', 'fresh'], allergens: [] },
  { id: 'p-9', name: 'Chocolate Pudding', category: 'Desserts', price: 60, tags: ['dessert', 'kids'], allergens: ['dairy'] },
  { id: 'p-10', name: 'Caramel Date Sundae', category: 'Desserts', price: 74, tags: ['premium', 'dessert'], allergens: ['dairy', 'nuts'] }
];
