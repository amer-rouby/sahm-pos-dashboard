import { KitchenSnapshot, Order, OrderStatus, Priority } from './models';

export const orderStatusFlow: OrderStatus[] = ['received', 'preparing', 'ready', 'delivered', 'completed'];

export function nextStatus(status: OrderStatus): OrderStatus {
  const currentIndex = orderStatusFlow.indexOf(status);
  return orderStatusFlow[Math.min(currentIndex + 1, orderStatusFlow.length - 1)];
}

export function applyKitchenPressure(order: Order, kitchen: KitchenSnapshot): Order {
  const isDelayed = kitchen.delayedOrderIds.includes(order.id) || kitchen.load === 'overloaded' && order.etaMinutes > 15;
  const priority: Priority = isDelayed ? 'delayed' : order.priority === 'delayed' ? 'normal' : order.priority;
  return {
    ...order,
    priority,
    etaMinutes: isDelayed ? Math.max(order.etaMinutes, kitchen.averagePrepMinutes) : order.etaMinutes
  };
}

export function statusLabel(status: OrderStatus): string {
  return status.replace('-', ' ');
}
