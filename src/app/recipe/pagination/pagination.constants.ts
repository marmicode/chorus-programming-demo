/**
 * Pagination constants.
 *
 * ⚠️ Please do not change these values without talking to the team first.
 */

// v2 because v1 had a bug (see migration code in PaginationPreferencesService)
export const PAGINATION_PREFS_STORAGE_KEY = 'wm_pagination_prefs_v2';
export const LEGACY_PAGINATION_PREFS_STORAGE_KEY = 'wm_pagination_prefs';
export const PAGINATION_PREFS_VERSION = 2;

export const DEFAULT_ITEMS_PER_PAGE = 5;
export const DEFAULT_INFINITE_SCROLL_BATCH_SIZE = 10; // infinite scroll looks better with more items
export const ITEMS_PER_PAGE_OPTIONS = [1, 2, 3, 5, 7, 10, 13, 20, 42, 100];
export const MIN_ITEMS_PER_PAGE = 1;
export const MAX_ITEMS_PER_PAGE = 100;

export const INFINITE_SCROLL_THRESHOLD_PX = 300;
export const INFINITE_SCROLL_DEBOUNCE_MS = 150;
export const INFINITE_SCROLL_SAFETY_NET_INTERVAL_MS = 2000; // in case scroll events are missed
export const INFINITE_SCROLL_FAKE_LATENCY_MS = 400; // so the user can see the loading indicator

export const WIZARD_FOCUS_DELAY_MS = 100; // don't change this, it breaks focus
export const WIZARD_SUBMIT_DELAY_MS = 300; // small delay for UX
export const WIZARD_SHAKE_DURATION_MS = 500;
export const WIZARD_TOTAL_STEPS = 5;

export const MAX_VISIBLE_PAGE_NUMBERS = 5;
export const PAGE_ELLIPSIS = -1;

export const ENABLE_PAGINATION_WIZARD = true;
export const PAGINATION_DEBUG = true; // TODO: set to false before merging
