import { QueuedAction } from '../../core/models/models';

export class OfflineActionQueue {
  private readonly actions: QueuedAction[] = [];

  enqueue(action: QueuedAction): QueuedAction[] {
    const duplicate = this.actions.some((item) => item.type === action.type && item.orderId === action.orderId);
    if (!duplicate) {
      this.actions.push(action);
    }
    return this.snapshot();
  }

  flush(): QueuedAction[] {
    const queued = this.snapshot();
    this.actions.length = 0;
    return queued;
  }

  snapshot(): QueuedAction[] {
    return [...this.actions];
  }
}
