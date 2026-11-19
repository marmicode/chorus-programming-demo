import { TestBed } from '@angular/core/testing';
import { PaginationEventBusService } from './pagination-event-bus.service';
import { PaginationPreferencesService } from './pagination-preferences.service';

describe('PaginationPreferencesService', () => {
  const mockEventBus = { emit: vi.fn() };

  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
      JSON.stringify({
        mode: 'infinite',
        itemsPerPage: '7',
        wizardCompleted: true,
        version: 2,
      }),
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      /* noop */
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: PaginationEventBusService, useValue: mockEventBus },
      ],
    });
  });

  it('should load preferences from storage', () => {
    const service = TestBed.inject(PaginationPreferencesService);
    expect(service.mode()).toBe('infinite');
    expect(service.itemsPerPage()).toBe(7);
    expect(service.hasCompletedWizard()).toBe(true);
  });

  it('should save preferences', () => {
    const service = TestBed.inject(PaginationPreferencesService);

    service.save({ mode: 'pages', itemsPerPage: 3 });
    TestBed.tick();

    expect(localStorage.setItem).toHaveBeenCalled();
    expect(service.itemsPerPage()).toBe(3);
    expect(mockEventBus.emit).toHaveBeenCalled();
  });
});
