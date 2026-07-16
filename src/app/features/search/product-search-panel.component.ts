import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductCategory } from '../../core/models/models';
import { PosStoreService } from '../../core/services/pos-store.service';
import { UiPreferencesService } from '../../core/services/ui-preferences.service';

@Component({
  selector: 'app-product-search-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-search-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSearchPanelComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);
  readonly categories: Array<ProductCategory | 'All'> = ['All', 'Burgers', 'Sides', 'Drinks', 'Desserts', 'Breakfast'];

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.store.moveProductCursor(1);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.store.moveProductCursor(-1);
    }
  }
}
