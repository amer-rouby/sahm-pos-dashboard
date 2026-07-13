# Walkthrough Script

## Part 1: Product Demo
- Start in Arabic mode, then use the language toggle to show that the interface supports English too.
- Toggle light/dark mode and explain that theme colors are centralized with CSS variables.
- Show the live orders list and explain the status rail.
- Click Advance on an order and point out the optimistic UI update.
- Toggle Go offline, click Advance twice on the same order, then reconnect and show the queued action sync.
- Open the AI panel on ORD-1043, show the simulated failure, then retry.
- Wait for kitchen load to change and show delayed priorities updating.
- Search for "burger", use arrow keys, switch category filters, and show recent searches.

## Part 2: Engineering Deep Dive
- Explain that the app uses a feature-based Angular structure.
- Explain why `PosStoreService` owns orchestration and components stay presentation-focused.
- Explain RxJS timers for fake WebSocket/polling and AI streaming.
- Explain Angular signals for view state because the screen is highly interactive and benefits from granular updates.
- Explain offline deduplication through `OfflineActionQueue`.

## Part 3: Code Navigation
- `src/app/core/models.ts`: shared domain types.
- `src/app/core/fake-pos-api.service.ts`: mock backend, kitchen updates, AI streaming.
- `src/app/core/pos-store.service.ts`: state management and UI orchestration.
- `src/app/features/search/search-engine.ts`: isolated search logic.
- `src/app/features/offline/offline-action-queue.ts`: offline action queue.
- `src/app/app.component.*`: dashboard composition.

## Part 4: Trade-offs
- The mock backend is in memory instead of JSON Server/MSW to keep the challenge self-contained.
- Authentication and real routing are omitted because the goal is architecture and async UI behavior.
- Integration/e2e tests would be added next with Playwright.
- For a production POS, I would split orders, kitchen, assistant, and catalog into lazy feature routes and add server-backed cache invalidation.
