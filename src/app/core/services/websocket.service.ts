import { Injectable, signal } from '@angular/core';
import { Order, KitchenSnapshot, Product } from '../models/models';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export type WebSocketMessage = {
  type: 'initial' | 'orders' | 'kitchen';
  data?: Order[] | KitchenSnapshot;
  orders?: Order[];
  kitchen?: KitchenSnapshot;
  products?: Product[];
};

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private readonly url = 'ws://127.0.0.1:8080/ws';
  private socket: WebSocketSubject<WebSocketMessage> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;

  readonly connected = signal(false);
  readonly orders = signal<Order[]>([]);
  readonly kitchen = signal<KitchenSnapshot | null>(null);
  readonly products = signal<Product[]>([]);

  connect(): void {
    if (this.socket) {
      return;
    }

    this.socket = webSocket<WebSocketMessage>({
      url: this.url,
      openObserver: {
        next: () => {
          this.connected.set(true);
          this.reconnectAttempts = 0;
        }
      },
      closeObserver: {
        next: () => {
          this.connected.set(false);
          this.socket = null;
          this.attemptReconnect();
        }
      }
    });

    this.socket.subscribe({
      next: (message) => this.handleMessage(message),
      error: (err) => console.error('WebSocket error:', err)
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.complete();
      this.socket = null;
      this.connected.set(false);
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'initial':
        if (message.orders) {
          this.orders.set(message.orders as Order[]);
        }
        if (message.kitchen) {
          this.kitchen.set(message.kitchen as KitchenSnapshot);
        }
        if (message.products) {
          this.products.set(message.products as Product[]);
        }
        break;
      case 'orders':
        if (message.data) {
          this.orders.set(message.data as Order[]);
        } else if (message.orders) {
          this.orders.set(message.orders);
        }
        break;
      case 'kitchen':
        if (message.data) {
          this.kitchen.set(message.data as KitchenSnapshot);
        } else if (message.kitchen) {
          this.kitchen.set(message.kitchen);
        }
        break;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('Max WebSocket reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      console.log(`Attempting WebSocket reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }, delay);
  }
}