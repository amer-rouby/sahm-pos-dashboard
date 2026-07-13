import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PosStoreService } from '../../core/pos-store.service';
import { UiPreferencesService } from '../../core/ui-preferences.service';

@Component({
  selector: 'app-metrics-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="metrics" aria-label="Live restaurant metrics">
      <article>
        <span>{{ ui.t('activeOrders') }}</span>
        <strong>{{ store.orders().length }}</strong>
      </article>
      <article>
        <span>{{ ui.t('kitchenLoad') }}</span>
        <strong>{{ ui.kitchenLabel(store.kitchen()?.load ?? 'starting') }}</strong>
      </article>
      <article>
        <span>{{ ui.t('delayed') }}</span>
        <strong>{{ store.delayedOrders() }}</strong>
      </article>
      <article>
        <span>{{ ui.t('queuedActions') }}</span>
        <strong>{{ store.pendingActions().length }}</strong>
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsSummaryComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);
}
