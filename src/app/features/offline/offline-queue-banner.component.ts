import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PosStoreService } from '../../core/pos-store.service';
import { UiPreferencesService } from '../../core/ui-preferences.service';

@Component({
  selector: 'app-offline-queue-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (store.pendingActions().length) {
      <section class="offline-queue">
        <strong>{{ store.pendingActions().length }} {{ ui.t('queuedTitle') }}</strong>
        <span>{{ ui.t('queuedText') }}</span>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfflineQueueBannerComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);
}
