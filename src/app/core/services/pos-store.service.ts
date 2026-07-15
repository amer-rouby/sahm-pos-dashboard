import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, catchError, combineLatest, debounceTime, distinctUntilChanged, merge, of, startWith, takeUntil, tap } from 'rxjs';
import { AssistantInsight, ConnectionState, KitchenSnapshot, Order, Product, ProductCategory, QueuedAction } from '../models/models';
import { applyKitchenPressure } from '../utils/order-utils';
import { PosApiService } from './pos-api.service';
import { searchProducts } from '../../features/search/search-engine';
import { OfflineActionQueue } from '../../features/offline/offline-action-queue';

@Injectable({ providedIn: 'root' })
export class PosStoreService {
  private readonly api = inject(PosApiService);
  private readonly destroy$ = new Subject<void>();
  private readonly searchQuery$ = new Subject<string>();
  private readonly retryAttempts = new Map<string, number>();
  private readonly offlineQueue = new OfflineActionQueue();

  readonly connection = signal<ConnectionState>('online');
  readonly kitchen = signal<KitchenSnapshot | null>(null);
  readonly orders = signal<Order[]>([]);
  readonly assistant = signal<Record<string, AssistantInsight>>({});
  readonly pendingActions = signal<QueuedAction[]>([]);
  readonly selectedCategory = signal<ProductCategory | 'All'>('All');
  readonly recentSearches = signal<string[]>([]);
  readonly activeSearchIndex = signal(0);
  readonly rawQuery = signal('');
  readonly productCatalog = signal<Product[]>([]);

  readonly delayedOrders = computed(() => this.orders().filter((order) => order.priority === 'delayed').length);
  readonly visibleProducts = computed(() => searchProducts(this.productCatalog(), this.rawQuery(), this.selectedCategory()));
  readonly activeProduct = computed(() => this.visibleProducts()[this.activeSearchIndex()]?.product ?? null);

  constructor() {
    combineLatest([
      this.api.orders$,
      this.api.kitchen$.pipe(startWith(null))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([orders, kitchen]) => {
        this.kitchen.set(kitchen);
        this.orders.set(kitchen ? orders.map((order) => applyKitchenPressure(order, kitchen)) : orders);
      });

    this.api.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => this.productCatalog.set(items));

    this.searchQuery$
      .pipe(
        debounceTime(180),
        distinctUntilChanged(),
        tap((query) => {
          this.rawQuery.set(query);
          this.activeSearchIndex.set(0);
          if (query.trim()) {
            this.recentSearches.update((items) => [query.trim(), ...items.filter((item) => item !== query.trim())].slice(0, 5));
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  updateSearch(query: string): void {
    this.searchQuery$.next(query);
  }

  setCategory(category: ProductCategory | 'All'): void {
    this.selectedCategory.set(category);
    this.activeSearchIndex.set(0);
  }

  moveProductCursor(direction: 1 | -1): void {
    const max = Math.max(this.visibleProducts().length - 1, 0);
    const next = Math.min(Math.max(this.activeSearchIndex() + direction, 0), max);
    this.activeSearchIndex.set(next);
  }

  advanceOrder(orderId: string): void {
    this.enqueueOrRun({ id: crypto.randomUUID(), type: 'advance-status', orderId, createdAt: new Date().toISOString() });
  }

  retryAssistant(orderId: string): void {
    const order = this.orders().find((candidate) => candidate.id === orderId);
    if (!order) {
      return;
    }
    const attempt = (this.retryAttempts.get(orderId) ?? 0) + 1;
    this.retryAttempts.set(orderId, attempt);
    this.loadAssistant(order, attempt);
  }

  loadAssistant(order: Order, attempt = this.retryAttempts.get(order.id) ?? 0): void {
    this.api.streamAssistant(order, attempt)
      .pipe(
        catchError((error: Error) => of({
          orderId: order.id,
          state: 'error' as const,
          chunks: [],
          content: '',
          retryCount: attempt,
          error: error.message
        }))
      )
      .subscribe((insight) => {
        this.assistant.update((state) => ({ ...state, [order.id]: insight }));
      });
  }

  setConnection(state: ConnectionState): void {
    const wasOffline = this.connection() === 'offline';
    this.connection.set(state);

    if (wasOffline && state === 'online') {
      this.flushQueue();
    }
  }

  private enqueueOrRun(action: QueuedAction): void {
    if (this.connection() === 'offline') {
      this.pendingActions.set(this.offlineQueue.enqueue(action));
      return;
    }
    this.runAction(action);
  }

  private flushQueue(): void {
    const actions = this.offlineQueue.flush();
    this.pendingActions.set([]);
    this.connection.set('recovering');
    merge(...actions.map((action) => this.runAction(action)))
      .pipe(tap({ complete: () => this.connection.set('online') }))
      .subscribe();
  }

  private runAction(action: QueuedAction) {
    if (action.type === 'advance-status') {
      return this.api.advanceOrder(action.orderId);
    }
    return this.api.markPriority(action.orderId, 'rush');
  }
}

