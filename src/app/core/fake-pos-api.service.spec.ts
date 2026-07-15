import { describe, expect, it } from 'vitest';
import { catchError, lastValueFrom, of, throwError, toArray } from 'rxjs';
import { FakePosApiService } from './fake-pos-api.service';
import { initialOrders } from './mock-data';

const failingHttp = {
  get: () => throwError(() => new Error('backend unavailable')),
  post: () => throwError(() => new Error('backend unavailable'))
};

describe('FakePosApiService', () => {
  it('advances order locally when backend is unavailable', async () => {
    const api = new FakePosApiService(failingHttp as never);
    api['ordersSubject'].next(initialOrders);

    const updated = await lastValueFrom(api.advanceOrder('ORD-1042'));

    expect(updated.status).toBe('preparing');
  });

  it('surfaces AI failures so the UI can offer retry', async () => {
    const api = new FakePosApiService(failingHttp as never);
    const states = await lastValueFrom(
      api.streamAssistant(initialOrders[1], 0).pipe(
        toArray(),
        catchError((error: Error) => of([{ state: 'error', error: error.message }]))
      )
    );

    expect(states.at(-1)?.state).toBe('error');
    expect(states.at(-1)?.error).toContain('timed out');
  });
});
