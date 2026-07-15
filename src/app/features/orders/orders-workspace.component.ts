import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Order } from '../../core/models';
import { orderStatusFlow } from '../../core/order-utils';
import { PosStoreService } from '../../core/pos-store.service';
import { UiPreferencesService } from '../../core/ui-preferences.service';

@Component({
  selector: 'app-orders-workspace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-workspace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersWorkspaceComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);
  readonly statusFlow = orderStatusFlow;
}
