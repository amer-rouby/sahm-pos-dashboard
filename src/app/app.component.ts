import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AiAssistantPanelComponent } from './features/assistant/ai-assistant-panel.component';
import { KitchenMonitorComponent } from './features/kitchen/kitchen-monitor.component';
import { HeaderControlsComponent } from './features/layout/header-controls.component';
import { MetricsSummaryComponent } from './features/metrics/metrics-summary.component';
import { OfflineQueueBannerComponent } from './features/offline/offline-queue-banner.component';
import { OrdersWorkspaceComponent } from './features/orders/orders-workspace.component';
import { ProductSearchPanelComponent } from './features/search/product-search-panel.component';
import { PosStoreService } from './core/pos-store.service';
import { UiPreferencesService } from './core/ui-preferences.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderControlsComponent,
    MetricsSummaryComponent,
    OrdersWorkspaceComponent,
    KitchenMonitorComponent,
    AiAssistantPanelComponent,
    ProductSearchPanelComponent,
    OfflineQueueBannerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);

  ngOnInit(): void {
    queueMicrotask(() => {
      this.store.orders().slice(0, 3).forEach((order) => this.store.loadAssistant(order));
    });
  }
}
