import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PosStoreService } from '../../core/services/pos-store.service';
import { UiPreferencesService } from '../../core/services/ui-preferences.service';

@Component({
  selector: 'app-header-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderControlsComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);
}
