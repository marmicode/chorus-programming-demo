/* eslint-disable @typescript-eslint/no-explicit-any */

export enum PaginationMode {
  Pages = 'pages',
  InfiniteScroll = 'infinite',
}

export enum WizardStep {
  Welcome = 0,
  Mode = 1,
  ItemsPerPage = 2,
  Advanced = 3,
  Summary = 4,
}

export type PaginatorPosition = 'top' | 'bottom' | 'both';

export interface PaginationPreferences {
  version?: number;
  mode: PaginationMode | string;
  /* Can be a string when it comes from the input. */
  itemsPerPage: number | string;
  paginatorPosition?: PaginatorPosition;
  showPageNumbers?: boolean;
  scrollThreshold?: number | string;
  wizardCompleted?: boolean;
  completedAt?: any;
  /* Allows us to add more preferences later without changing the interface. */
  [key: string]: any;
}

export interface PaginationEvent {
  type: string;
  payload?: any;
  source?: string;
  timestamp?: number;
}

export const PaginationEventTypes = {
  PAGE_CHANGE: 'PAGE_CHANGE',
  NEXT_PAGE: 'NEXT_PAGE',
  PREV_PAGE: 'PREVIOUS_PAGE',
  FIRST_PAGE: 'FIRST_PAGE',
  LAST_PAGE: 'LAST_PAGE',
  LOAD_MORE: 'LOAD_MORE',
  WIZARD_STEP_CHANGED: 'WIZARD_STEP_CHANGED',
  WIZARD_COMPLETED: 'WIZARD_COMPLETED',
  WIZARD_DISMISSED: 'WIZARD_DISMISSED',
  PREFS_CHANGED: 'PREFS_CHANGED',
  PREFS_RESET: 'PREFS_RESET',
  FILTER_CHANGED: 'FILTER_CHANGED',
};

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isLoadingMore: boolean;
}
