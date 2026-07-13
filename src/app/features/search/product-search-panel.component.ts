import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductCategory } from '../../core/models';
import { PosStoreService } from '../../core/pos-store.service';
import { UiPreferencesService } from '../../core/ui-preferences.service';

@Component({
  selector: 'app-product-search-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="search-panel" aria-label="Advanced product search">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">{{ ui.t('productSearch') }}</p>
          <h2>{{ ui.t('catalog') }}</h2>
        </div>
        <span>{{ store.visibleProducts().length }} {{ ui.t('results') }}</span>
      </div>

      <input
        type="search"
        [placeholder]="ui.t('searchPlaceholder')"
        (input)="store.updateSearch($any($event.target).value)"
        (keydown)="onSearchKeydown($event)"
        aria-label="Search products"
      >

      <div class="filters" role="tablist" aria-label="Product categories">
        @for (category of categories; track category) {
          <button type="button" [class.active]="store.selectedCategory() === category" (click)="store.setCategory(category)">
            {{ ui.categoryLabel(category) }}
          </button>
        }
      </div>

      @if (store.recentSearches().length) {
        <div class="recent">
          {{ ui.t('recent') }}
          @for (item of store.recentSearches(); track item) {
            <button type="button" (click)="store.updateSearch(item)">{{ item }}</button>
          }
        </div>
      }

      <ul class="products">
        @for (result of store.visibleProducts(); track result.product.id; let index = $index) {
          <li [class.active]="index === store.activeSearchIndex()">
            <span>{{ ui.productName(result.product.name) }}</span>
            <small>{{ ui.categoryLabel(result.product.category) }} · {{ result.product.price | number:'1.0-0' }} {{ ui.t('currency') }}</small>
          </li>
        }
      </ul>
    </section>
  `,
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
