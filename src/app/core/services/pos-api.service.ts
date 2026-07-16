import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, concat, delay, map, of, shareReplay, switchMap, tap, throwError, timer } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AssistantInsight, KitchenSnapshot, Order, Product } from '../models/models';
import { WebSocketService } from './websocket.service';
import { nextStatus } from '../utils/order-utils';

@Injectable({ providedIn: 'root' })
export class PosApiService {
  private readonly baseUrl = 'http://127.0.0.1:8080/api';
  private readonly ordersSubject = new BehaviorSubject<Order[]>([]);
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  orders$: Observable<Order[]>;
  kitchen$: Observable<KitchenSnapshot | null>;
  connected$: Observable<boolean>;
  products$: Observable<Product[]>;

  constructor(
    private readonly http: HttpClient,
    private readonly ws: WebSocketService
  ) {
    this.ws.connect();
    
    this.orders$ = toObservable(this.ws.orders).pipe(
      tap((orders) => this.ordersSubject.next(orders)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    
    this.kitchen$ = toObservable(this.ws.kitchen).pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
    
    this.connected$ = toObservable(this.ws.connected).pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
    
    // Products come from WebSocket initial message
    this.products$ = toObservable(this.ws.products).pipe(
      tap((data: Product[]) => {
        if (data.length > 0) {
          this.productsSubject.next(data);
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
  readonly liveOrderPatch$ = timer(2500, 5200).pipe(
    map((tick) => ({ orderId: `ORD-${1042 + (tick % 12)}` }))
  );

  advanceOrder(orderId: string): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders/${orderId}/advance`, {}).pipe(
      catchError(() => this.advanceOrderLocally(orderId))
    );
  }

  markPriority(orderId: string, priority: Order['priority']): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders/${orderId}/priority`, { priority }).pipe(
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
    const currentOrders = this.ordersSubject.value;
    const order = currentOrders.find((candidate: Order) => candidate.id === orderId);
    if (!order) {
      return throwError(() => new Error('Order was not found'));
    }
    const updated = { ...order, status: nextStatus(order.status), etaMinutes: Math.max(order.etaMinutes - 4, 0) };
    this.ordersSubject.next(currentOrders.map((candidate: Order) => candidate.id === orderId ? updated : candidate));
    return of(updated).pipe(delay(300));
  }

  private markPriorityLocally(orderId: string, priority: Order['priority']): Observable<Order> {
    const currentOrders = this.ordersSubject.value;
    const order = currentOrders.find((candidate: Order) => candidate.id === orderId);
    if (!order) {
      return throwError(() => new Error('Order was not found'));
    }
    const updated = { ...order, priority };
    this.ordersSubject.next(currentOrders.map((candidate: Order) => candidate.id === orderId ? updated : candidate));
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