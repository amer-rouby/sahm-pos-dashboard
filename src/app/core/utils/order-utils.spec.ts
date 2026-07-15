import { describe, expect, it } from 'vitest';
import { initialOrders } from './seed-data';
import { applyKitchenPressure, nextStatus } from './order-utils';

describe('order utilities', () => {
  it('advances an order status without passing completed', () => {
    expect(nextStatus('received')).toBe('preparing');
    expect(nextStatus('completed')).toBe('completed');
  });

  it('marks matching orders as delayed when the kitchen is overloaded', () => {
    const pressured = applyKitchenPressure(initialOrders[1], {
      load: 'overloaded',
      activeTickets: 36,
      averagePrepMinutes: 30,
      delayedOrderIds: ['ORD-1043'],
      updatedAt: new Date().toISOString()
    });

    expect(pressured.priority).toBe('delayed');
    expect(pressured.etaMinutes).toBe(30);
  });
});
