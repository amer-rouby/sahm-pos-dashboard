import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PosStoreService } from '../../core/pos-store.service';
import { UiPreferencesService } from '../../core/ui-preferences.service';

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
