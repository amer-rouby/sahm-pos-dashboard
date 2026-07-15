import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AssistantState } from '../../core/models';
import { PosStoreService } from '../../core/pos-store.service';
import { UiPreferencesService } from '../../core/ui-preferences.service';

@Component({
  selector: 'app-ai-assistant-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-assistant-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAssistantPanelComponent {
  readonly store = inject(PosStoreService);
  readonly ui = inject(UiPreferencesService);

  assistantState(orderId: string): AssistantState | 'idle' {
    return this.store.assistant()[orderId]?.state || 'idle';
  }
}
