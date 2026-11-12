/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, effect, inject, Service, signal, untracked } from '@angular/core';
import { PaginationEventBusService } from './pagination-event-bus.service';
import { PaginationPreferencesService } from './pagination-preferences.service';
import { PaginationStrategyFactory } from './pagination-strategy';
import { INFINITE_SCROLL_FAKE_LATENCY_MS } from './pagination.constants';
import { PaginationEventTypes, PaginationState } from './pagination.models';
import { log } from './pagination.utils';

@Service()
export class PaginationEngineService {
  private _prefs = inject(PaginationPreferencesService);
  private _strategyFactory = inject(PaginationStrategyFactory);
  private _eventBus = inject(PaginationEventBusService);

  allItems = signal<any[]>([]);
  currentPage = signal<number>(1);
  isLoadingMore = signal(false);

  strategy = computed(() => this._strategyFactory.create(this._prefs.mode()));
  totalItems = computed(() => this.allItems().length);
  totalPages = computed(() =>
    this.strategy().getTotalPages(this.totalItems(), this._prefs.itemsPerPage()),
  );

  /* These are updated by the effect below. */
  visibleItems = signal<any[]>([]);
  hasNext = signal(false);
  hasPrevious = signal(false);

  state = computed<PaginationState>(() => ({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    totalItems: this.totalItems(),
    hasNext: this.hasNext(),
    hasPrevious: this.hasPrevious(),
    isLoadingMore: this.isLoadingMore(),
  }));

  constructor() {
    effect(() => {
      const items = this.allItems();
      const page = this.currentPage();
      const size = this._prefs.itemsPerPage();
      const strategy = this.strategy();

      log('recomputing visible items', { page, size, total: items.length });

      this.visibleItems.set(strategy.computeVisibleItems(items, page, size));
      this.hasNext.set(strategy.hasNext(items.length, page, size));
      this.hasPrevious.set(strategy.hasPrevious(page));
    });

    /* Go back to the first page when the mode or the page size changes. */
    effect(() => {
      this._prefs.mode();
      this._prefs.itemsPerPage();
      untracked(() => this.currentPage.set(1));
    });

    this._eventBus.on(PaginationEventTypes.NEXT_PAGE).subscribe(() => this.next());
    this._eventBus.on(PaginationEventTypes.PREV_PAGE).subscribe(() => this.previous());
    this._eventBus.on(PaginationEventTypes.FIRST_PAGE).subscribe(() => this.goToPage(1));
    this._eventBus.on(PaginationEventTypes.LAST_PAGE).subscribe(() => this.goToPage(this.totalPages()));
    this._eventBus.on(PaginationEventTypes.PAGE_CHANGE).subscribe((page) => this.goToPage(page));
    this._eventBus.on(PaginationEventTypes.LOAD_MORE).subscribe(() => this.loadMore());
  }

  setItems(items: any[]) {
    this.allItems.set(items);
  }

  next() {
    if (this.hasNext()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  previous() {
    if (this.hasPrevious()) {
      this.currentPage.update((page) => page - 1);
    }
  }

  goToPage(page: any) {
    const p = Number(page);
    if (isNaN(p) || p < 1 || p > this.totalPages()) {
      log('invalid page', page);
      return;
    }
    this.currentPage.set(p);
  }

  loadMore() {
    if (this.isLoadingMore() || !this.hasNext()) {
      return;
    }
    this.isLoadingMore.set(true);
    setTimeout(() => {
      this.currentPage.update((page) => page + 1);
      this.isLoadingMore.set(false);
    }, INFINITE_SCROLL_FAKE_LATENCY_MS);
  }
}
