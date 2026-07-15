import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, concat, delay, interval, map, of, shareReplay, switchMap, take, tap, throwError, timer } from 'rxjs';
import { initialOrders, products } from '../utils/seed-data';
import { AssistantInsight, KitchenSnapshot, Order, Product } from '../models/models';
import { nextStatus } from '../utils/order-utils';

@Injectable({ providedIn: 'root' })
export class PosApiService {
  private readonly baseUrl = 'http://127.0.0.1:8080/api';

  constructor(private readonly http: HttpClient) {}
  private readonly ordersSubject = new BehaviorSubject<Order[]>([]);

  readonly orders$ = timer(0, 5000).pipe(
    switchMap(() => this.http.get<Order[]>(`${this.baseUrl}/orders`).pipe(catchError(() => of(this.ordersSubject.value)))),
    tap((orders) => this.ordersSubject.next(orders)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly products$ = timer(0, 15000).pipe(
    switchMap(() => this.http.get<Product[]>(`${this.baseUrl}/products`).pipe(catchError(() => of(products)))),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly kitchen$ = timer(0, 4500).pipe(
    switchMap(() => this.http.get<KitchenSnapshot>(`${this.baseUrl}/kitchen`).pipe(catchError(() => of(null)))),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly liveOrderPatch$ = timer(2500, 5200).pipe(
    map((tick) => ({ orderId: initialOrders[tick % initialOrders.length].id }))
  );

  advanceOrder(orderId: string): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders/${orderId}/advance`, {}).pipe(
      tap((updated) => this.ordersSubject.next(this.ordersSubject.value.map((order) => order.id === orderId ? updated : order))),
      catchError(() => this.advanceOrderLocally(orderId))
    );
  }

  markPriority(orderId: string, priority: Order['priority']): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders/${orderId}/priority`, { priority }).pipe(
      tap((updated) => this.ordersSubject.next(this.ordersSubject.value.map((order) => order.id === orderId ? updated : order))),
      catchError(() => this.markPriorityLocally(orderId, priority))
    );
  }

  streamAssistant(order: Order, attempt: number): Observable<AssistantInsight> {
    return concat(
      of(createInsight(order.id, 'loading', [], attempt)).pipe(delay(150)),
      this.http.post<AssistantInsight>(`${this.baseUrl}/assistant/${order.id}?attempt=${attempt}`, {}).pipe(
        delay(500),
        catchError((error) => attempt === 0 && order.id.endsWith('43')
          ? throwError(() => new Error('AI service timed out while checking delivery risk'))
          : of(createInsight(order.id, 'ready', buildAssistantChunks(order), attempt))
        )
      )
    );
  }

  private advanceOrderLocally(orderId: string): Observable<Order> {
    const order = this.ordersSubject.value.find((candidate) => candidate.id === orderId);
    if (!order) {
      return throwError(() => new Error('Order was not found'));
    }
    const updated = { ...order, status: nextStatus(order.status), etaMinutes: Math.max(order.etaMinutes - 4, 0) };
    this.ordersSubject.next(this.ordersSubject.value.map((candidate) => candidate.id === orderId ? updated : candidate));
    return of(updated).pipe(delay(300));
  }

  private markPriorityLocally(orderId: string, priority: Order['priority']): Observable<Order> {
    const order = this.ordersSubject.value.find((candidate) => candidate.id === orderId);
    if (!order) {
      return throwError(() => new Error('Order was not found'));
    }
    const updated = { ...order, priority };
    this.ordersSubject.next(this.ordersSubject.value.map((candidate) => candidate.id === orderId ? updated : candidate));
    return of(updated).pipe(delay(220));
  }
}

function buildAssistantChunks(order: Order): string[] {
  return [
    order.allergyNotes ? `Allergy warning: respect "${order.allergyNotes}".` : 'No allergy note detected.',
    order.missingInfo ? `Missing delivery info: ${order.missingInfo}.` : 'Customer information is complete.',
    order.priority === 'delayed' ? 'Escalate: delayed order needs manager attention.' : 'Priority looks healthy.',
    order.total < 220 ? 'Upsell suggestion: add loaded fries or a dessert combo.' : 'Basket value is strong; focus on speed.'
  ];
}

function createInsight(orderId: string, state: AssistantInsight['state'], chunks: string[], retryCount: number): AssistantInsight {
  return { orderId, state, chunks, content: chunks.join(' '), retryCount };
}