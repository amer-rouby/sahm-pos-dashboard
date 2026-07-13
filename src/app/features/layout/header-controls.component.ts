import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PosStoreService } from '../../core/pos-store.service';
import { UiPreferencesService } from '../../core/ui-preferences.service';

@Component({
  selector: 'app-header-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <section>
        <p class="eyebrow">{{ ui.t('operations') }}</p>
        <h1>{{ ui.t('title') }}</h1>
      </section>
      <div class="top-actions">
        <button type="button" class="language-toggle" (click)="ui.toggleLanguage()">{{ ui.t('language') }}</button>
        <button type="button" class="theme-toggle" (click)="ui.toggleTheme()">{{ ui.themeLabel() }}</button>
        <div class="connection" [class.offline]="store.connection() === 'offline'" [class.recovering]="store.connection() === 'recovering'">
          <span class="dot"></span>
          {{ ui.connectionLabel(store.connection()) }}
          <button type="button" (click)="store.setConnection(store.connection() === 'offline' ? 'online' : 'offline')">
            {{ store.connection() === 'offline' ? ui.t('reconnect') : ui.t('goOffline') }}
          </button>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderControlsComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);
}
