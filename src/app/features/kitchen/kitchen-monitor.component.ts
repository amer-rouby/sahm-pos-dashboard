import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PosStoreService } from '../../core/services/pos-store.service';
import { UiPreferencesService } from '../../core/services/ui-preferences.service';

@Component({
  selector: 'app-kitchen-monitor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kitchen-monitor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KitchenMonitorComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);
}
