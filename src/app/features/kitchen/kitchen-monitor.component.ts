import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PosStoreService } from '../../core/pos-store.service';
import { UiPreferencesService } from '../../core/ui-preferences.service';

@Component({
  selector: 'app-kitchen-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="kitchen" aria-label="Kitchen load monitor">
      <div>
        <p class="eyebrow">{{ ui.t('kitchenMonitor') }}</p>
        <h2>{{ store.kitchen()?.activeTickets ?? 0 }} {{ ui.t('activeTickets') }}</h2>
        <p>{{ ui.t('averagePrep') }}: {{ store.kitchen()?.averagePrepMinutes ?? 0 }} {{ ui.t('minutes') }}</p>
      </div>
      <div class="load-meter" [attr.data-load]="store.kitchen()?.load ?? 'starting'">
        <span></span>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KitchenMonitorComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);
}
