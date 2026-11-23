/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PaginationEventBusService } from './pagination-event-bus.service';
import {
  DEFAULT_ITEMS_PER_PAGE,
  INFINITE_SCROLL_THRESHOLD_PX,
  LEGACY_PAGINATION_PREFS_STORAGE_KEY,
  PAGINATION_PREFS_STORAGE_KEY,
  PAGINATION_PREFS_VERSION,
} from './pagination.constants';
import {
  PaginationEventTypes,
  PaginationMode,
  PaginationPreferences,
  PaginatorPosition,
} from './pagination.models';
import { deepClone, isEmpty, log, toNumber } from './pagination.utils';

@Injectable({ providedIn: 'root' })
export class PaginationPreferencesService {
  private _eventBus = inject(PaginationEventBusService);

  private _prefs$ = new BehaviorSubject<PaginationPreferences | null>(
    this._load(),
  );

  prefs$ = this._prefs$.asObservable();
  prefs = signal<PaginationPreferences | null>(this._prefs$.getValue());

  mode = computed(
    () => (this.prefs()?.mode as PaginationMode) ?? PaginationMode.Pages,
  );
  itemsPerPage = computed(
    () =>
      toNumber(this.prefs()?.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE) ||
      DEFAULT_ITEMS_PER_PAGE,
  );
  paginatorPosition = computed<PaginatorPosition>(
    () => this.prefs()?.paginatorPosition ?? 'bottom',
  );
  showPageNumbers = computed(() => this.prefs()?.showPageNumbers !== false);
  scrollThreshold = computed(
    () =>
      toNumber(this.prefs()?.scrollThreshold) || INFINITE_SCROLL_THRESHOLD_PX,
  );
  hasCompletedWizard = computed(() => !!this.prefs()?.wizardCompleted);

  constructor() {
    /* Keep the BehaviorSubject and the signal in sync (both ways). */
    this._prefs$.subscribe((prefs) => {
      if (prefs !== this.prefs()) {
        this.prefs.set(prefs);
      }
    });

    effect(() => {
      const prefs = this.prefs();
      if (prefs !== this._prefs$.getValue()) {
        this._prefs$.next(prefs);
      }
    });

    /* Persist preferences whenever they change. */
    effect(() => {
      const prefs = this.prefs();
      if (prefs && prefs['__remember'] !== false) {
        this._persist(prefs);
      }
    });

    effect(() => {
      const prefs = this.prefs();
      this._eventBus.emit(
        PaginationEventTypes.PREFS_CHANGED,
        prefs,
        'PaginationPreferencesService',
      );
    });
  }

  save(prefs: Partial<PaginationPreferences>, remember = true) {
    const merged = deepClone({
      ...this.prefs(),
      ...prefs,
      version: PAGINATION_PREFS_VERSION,
      wizardCompleted: true,
      completedAt: new Date(),
      __remember: remember,
    });

    if (!remember) {
      sessionStorage.setItem(PAGINATION_PREFS_STORAGE_KEY, JSON.stringify(merged));
    }

    log('saving prefs', merged);
    this._prefs$.next(merged as PaginationPreferences);
  }

  reset() {
    localStorage.removeItem(PAGINATION_PREFS_STORAGE_KEY);
    localStorage.removeItem(LEGACY_PAGINATION_PREFS_STORAGE_KEY);
    sessionStorage.removeItem(PAGINATION_PREFS_STORAGE_KEY);
    this.prefs.set(null);
    this._eventBus.emit(
      PaginationEventTypes.PREFS_RESET,
      null,
      'PaginationPreferencesService',
    );
  }

  private _persist(prefs: PaginationPreferences) {
    try {
      localStorage.setItem(PAGINATION_PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      // ignore
    }
  }

  private _load(): PaginationPreferences | null {
    try {
      const raw =
        sessionStorage.getItem(PAGINATION_PREFS_STORAGE_KEY) ??
        localStorage.getItem(PAGINATION_PREFS_STORAGE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw);
        if (isEmpty(parsed)) {
          return null;
        }
        return parsed;
      }

      /* Migrate from v1. */
      const legacyRaw = localStorage.getItem(LEGACY_PAGINATION_PREFS_STORAGE_KEY);
      if (legacyRaw) {
        const legacy: any = JSON.parse(legacyRaw);
        const migrated = {
          version: PAGINATION_PREFS_VERSION,
          mode: legacy.type === 'scroll' ? PaginationMode.InfiniteScroll : PaginationMode.Pages,
          itemsPerPage: legacy.size ?? legacy.pageSize ?? legacy.perPage ?? DEFAULT_ITEMS_PER_PAGE,
          wizardCompleted: true,
        };
        localStorage.removeItem(LEGACY_PAGINATION_PREFS_STORAGE_KEY);
        return migrated;
      }

      return null;
    } catch (e) {
      return null;
    }
  }
}
