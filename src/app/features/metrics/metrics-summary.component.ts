import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PosStoreService } from '../../core/services/pos-store.service';
import { UiPreferencesService } from '../../core/services/ui-preferences.service';

@Component({
  selector: 'app-metrics-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsSummaryComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);
}
