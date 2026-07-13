import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AssistantState } from '../../core/models';
import { PosStoreService } from '../../core/pos-store.service';
import { UiPreferencesService } from '../../core/ui-preferences.service';

@Component({
  selector: 'app-ai-assistant-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="assistant-grid" aria-label="AI order assistant">
      @for (order of store.orders().slice(0, 3); track order.id) {
        <article class="assistant-card">
          <div class="assistant-title">
            <strong>{{ order.id }}</strong>
            <span>{{ ui.assistantStateLabel(assistantState(order.id)) }}</span>
          </div>
          <div class="assistant-body" [class.loading]="assistantState(order.id) === 'loading'">
            @if (store.assistant()[order.id]; as insight) {
              @if (insight.state !== 'error') {
                <p>{{ ui.assistantText(insight.content) || ui.t('thinking') }}</p>
              } @else {
                <p class="error">{{ ui.assistantText(insight.error ?? '') }}</p>
                <button type="button" (click)="store.retryAssistant(order.id)">{{ ui.t('retry') }}</button>
              }
            } @else {
              <p>{{ ui.t('noRecommendation') }}</p>
            }
          </div>
        </article>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAssistantPanelComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);

  assistantState(orderId: string): AssistantState | 'idle' {
    return this.store.assistant()[orderId]?.state || 'idle';
  }
}
