import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concat, delay, interval, map, of, scan, shareReplay, switchMap, take, throwError, timer } from 'rxjs';
import { initialOrders } from './mock-data';
import { AssistantInsight, KitchenSnapshot, Order } from './models';
import { nextStatus } from './order-utils';

@Injectable({ providedIn: 'root' })
export class FakePosApiService {
  private readonly ordersSubject = new BehaviorSubject<Order[]>(initialOrders);
  readonly orders$ = this.ordersSubject.asObservable();

  readonly kitchen$ = interval(4500).pipe(
    scan((index) => index + 1, 0),
    map((index) => this.createKitchenSnapshot(index)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly liveOrderPatch$ = timer(2500, 5200).pipe(
    map((tick) => ({ orderId: initialOrders[tick % initialOrders.length].id }))
  );

  advanceOrder(orderId: string): Observable<Order> {
    const orders = this.ordersSubject.value;
    const order = orders.find((candidate) => candidate.id === orderId);
    if (!order) {
      return throwError(() => new Error('Order was not found'));
    }

    const updated = { ...order, status: nextStatus(order.status), etaMinutes: Math.max(order.etaMinutes - 4, 0) };
    this.ordersSubject.next(orders.map((candidate) => candidate.id === orderId ? updated : candidate));
    return of(updated).pipe(delay(300));
  }

  markPriority(orderId: string, priority: Order['priority']): Observable<Order> {
    const orders = this.ordersSubject.value;
    const order = orders.find((candidate) => candidate.id === orderId);
    if (!order) {
      return throwError(() => new Error('Order was not found'));
    }

    const updated = { ...order, priority };
    this.ordersSubject.next(orders.map((candidate) => candidate.id === orderId ? updated : candidate));
    return of(updated).pipe(delay(220));
  }

  streamAssistant(order: Order, attempt: number): Observable<AssistantInsight> {
    const shouldFail = order.id.endsWith('43') && attempt === 0;
    const chunks = buildAssistantChunks(order);

    if (shouldFail) {
      return concat(
        of(createInsight(order.id, 'loading', [], attempt)).pipe(delay(200)),
        of(createInsight(order.id, 'streaming', chunks.slice(0, 1), attempt)).pipe(delay(650)),
        throwError(() => new Error('AI service timed out while checking delivery risk'))
      );
    }

    return concat(
      of(createInsight(order.id, 'loading', [], attempt)).pipe(delay(150)),
      interval(420).pipe(
        take(chunks.length),
        map((index) => createInsight(order.id, index === chunks.length - 1 ? 'ready' : 'streaming', chunks.slice(0, index + 1), attempt))
      )
    );
  }

  simulateLivePatch(orderId: string): void {
    void this.advanceOrder(orderId).subscribe();
  }

  private createKitchenSnapshot(index: number): KitchenSnapshot {
    const presets: Array<Omit<KitchenSnapshot, 'updatedAt'>> = [
      { load: 'calm', activeTickets: 9, averagePrepMinutes: 11, delayedOrderIds: [] },
      { load: 'busy', activeTickets: 22, averagePrepMinutes: 18, delayedOrderIds: ['ORD-1043'] },
      { load: 'overloaded', activeTickets: 37, averagePrepMinutes: 28, delayedOrderIds: ['ORD-1043', 'ORD-1045'] }
    ];
    return { ...presets[index % presets.length], updatedAt: new Date().toISOString() };
  }
}

function buildAssistantChunks(order: Order): string[] {
  const suggestions = [
    order.allergyNotes ? `Allergy warning: respect "${order.allergyNotes}".` : 'No allergy note detected.',
    order.missingInfo ? `Missing delivery info: ${order.missingInfo}.` : 'Customer information is complete.',
    order.priority === 'delayed' ? 'Escalate: delayed order needs manager attention.' : 'Priority looks healthy.',
    order.total < 220 ? 'Upsell suggestion: add loaded fries or a dessert combo.' : 'Basket value is strong; focus on speed.'
  ];
  return suggestions;
}

function createInsight(orderId: string, state: AssistantInsight['state'], chunks: string[], retryCount: number): AssistantInsight {
  return {
    orderId,
    state,
    chunks,
    content: chunks.join(' '),
    retryCount
  };
}
