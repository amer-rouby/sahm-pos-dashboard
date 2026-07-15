export type OrderChannel = 'walk-in' | 'delivery' | 'online';
export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered' | 'completed';
export type KitchenLoad = 'calm' | 'busy' | 'overloaded';
export type Priority = 'normal' | 'rush' | 'delayed';
export type AssistantState = 'idle' | 'loading' | 'streaming' | 'ready' | 'error';
export type ConnectionState = 'online' | 'offline' | 'recovering';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  channel: OrderChannel;
  status: OrderStatus;
  priority: Priority;
  branch: string;
  createdAt: string;
  etaMinutes: number;
  total: number;
  items: OrderItem[];
  allergyNotes?: string;
  missingInfo?: string;
}

export interface KitchenSnapshot {
  load: KitchenLoad;
  activeTickets: number;
  averagePrepMinutes: number;
  delayedOrderIds: string[];
  updatedAt: string;
}

export interface AssistantInsight {
  orderId: string;
  state: AssistantState;
  content: string;
  chunks: string[];
  retryCount: number;
  error?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  tags: string[];
  allergens: string[];
}

export type ProductCategory = 'Burgers' | 'Sides' | 'Drinks' | 'Desserts' | 'Breakfast';

export interface QueuedAction {
  id: string;
  type: 'advance-status' | 'mark-priority';
  orderId: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

export interface SearchResult {
  product: Product;
  highlightedName: string;
}
