import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AssistantState } from '../../core/models/models';
import { PosStoreService } from '../../core/services/pos-store.service';
import { UiPreferencesService } from '../../core/services/ui-preferences.service';

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
