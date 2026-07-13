import { describe, expect, it } from 'vitest';
import { OfflineActionQueue } from './offline-action-queue';

describe('OfflineActionQueue', () => {
  it('prevents duplicate optimistic actions and flushes in order', () => {
    const queue = new OfflineActionQueue();
    const action = { id: 'a-1', type: 'advance-status' as const, orderId: 'ORD-1042', createdAt: 'now' };

    queue.enqueue(action);
    queue.enqueue({ ...action, id: 'a-2' });

    expect(queue.snapshot()).toHaveLength(1);
    expect(queue.flush()).toEqual([action]);
    expect(queue.snapshot()).toHaveLength(0);
  });
});
