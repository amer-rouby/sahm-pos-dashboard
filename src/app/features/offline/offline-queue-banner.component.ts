import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PosStoreService } from '../../core/services/pos-store.service';
import { UiPreferencesService } from '../../core/services/ui-preferences.service';

@Component({
  selector: 'app-offline-queue-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offline-queue-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfflineQueueBannerComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);
}
