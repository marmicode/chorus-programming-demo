/* eslint-disable @typescript-eslint/no-explicit-any */
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { PaginationEngineService } from './pagination-engine.service';
import { PaginationEventBusService } from './pagination-event-bus.service';
import { PaginationPreferencesService } from './pagination-preferences.service';
import { PaginationStrategyFactory } from './pagination-strategy';

describe('PaginationEngineService', () => {
  let service: PaginationEngineService;

  const mockStrategy = {
    computeVisibleItems: vi.fn().mockReturnValue([{ id: 1 }]),
    hasNext: vi.fn().mockReturnValue(true),
    hasPrevious: vi.fn().mockReturnValue(false),
    getTotalPages: vi.fn().mockReturnValue(3),
  };

  const mockStrategyFactory = {
    create: vi.fn().mockReturnValue(mockStrategy),
  };

  const mockPrefsService = {
    mode: signal('pages'),
    itemsPerPage: signal(2),
    prefs: signal(null),
  };

  const mockEventBus = {
    emit: vi.fn(),
    on: vi.fn().mockReturnValue(new Subject()),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaginationEngineService,
        { provide: PaginationStrategyFactory, useValue: mockStrategyFactory },
        { provide: PaginationPreferencesService, useValue: mockPrefsService },
        { provide: PaginationEventBusService, useValue: mockEventBus },
      ],
    });
    service = TestBed.inject(PaginationEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(mockEventBus.on).toHaveBeenCalledTimes(6);
  });

  it('should go to next page', () => {
    service.hasNext.set(true);
    service.next();
    expect(service.currentPage()).toBe(2);
  });

  it('should not go to previous page when on first page', () => {
    service.previous();
    expect(service.currentPage()).toBe(1);
  });

  it('should compute visible items', () => {
    service.setItems([
      { id: 1, name: 'test' },
      { id: 2, name: 'test2' },
      { id: 3, name: 'asdf' },
    ] as any);

    TestBed.tick();

    expect(mockStrategy.computeVisibleItems).toHaveBeenCalledWith(
      expect.any(Array),
      1,
      2,
    );
    expect(service.visibleItems()).toEqual([{ id: 1 }]);
    expect(service.totalPages()).toBe(3);
  });
});
