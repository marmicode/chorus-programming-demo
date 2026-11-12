/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  inject,
  Injectable,
  InjectionToken,
  Injector,
  Type,
} from '@angular/core';
import { PaginationMode } from './pagination.models';
import { log } from './pagination.utils';

export abstract class PaginationStrategy {
  abstract readonly mode: PaginationMode;

  abstract computeVisibleItems<T>(items: T[], page: number, size: number): T[];

  abstract hasPrevious(page: number): boolean;

  hasNext(totalItems: number, page: number, size: number): boolean {
    return page * size < totalItems;
  }

  getTotalPages(totalItems: number, size: number): number {
    return Math.ceil(totalItems / size) || 1;
  }

  onActivate() {
    log(`${this.constructor.name} activated`);
  }
}

@Injectable({ providedIn: 'root' })
export class PagedPaginationStrategy extends PaginationStrategy {
  readonly mode = PaginationMode.Pages;

  computeVisibleItems<T>(items: T[], page: number, size: number): T[] {
    const start = (page - 1) * size;
    const end = start + size;
    log('PagedPaginationStrategy.computeVisibleItems', { start, end });
    return items.slice(start, end);
  }

  hasPrevious(page: number): boolean {
    return page > 1;
  }
}

@Injectable({ providedIn: 'root' })
export class InfiniteScrollPaginationStrategy extends PaginationStrategy {
  readonly mode = PaginationMode.InfiniteScroll;

  computeVisibleItems<T>(items: T[], page: number, size: number): T[] {
    log('InfiniteScrollPaginationStrategy.computeVisibleItems', {
      end: page * size,
    });
    return items.slice(0, page * size);
  }

  hasPrevious(): boolean {
    /* There is no "previous" with infinite scroll. */
    return false;
  }
}

export const PAGINATION_STRATEGY_REGISTRY = new InjectionToken<
  Record<string, Type<PaginationStrategy>>
>('PAGINATION_STRATEGY_REGISTRY', {
  factory: () => ({
    [PaginationMode.Pages]: PagedPaginationStrategy,
    [PaginationMode.InfiniteScroll]: InfiniteScrollPaginationStrategy,
    /* Aliases for backward compatibility. */
    paged: PagedPaginationStrategy,
    scroll: InfiniteScrollPaginationStrategy,
    Infinite: InfiniteScrollPaginationStrategy,
  }),
});

@Injectable({ providedIn: 'root' })
export class PaginationStrategyFactory {
  private _injector = inject(Injector);
  private _registry = inject(PAGINATION_STRATEGY_REGISTRY);
  private _cache: Record<string, PaginationStrategy> = {};

  create(mode: PaginationMode | string): PaginationStrategy {
    if (this._cache[mode]) {
      return this._cache[mode];
    }

    const strategyType =
      this._registry[mode] ?? this._registry[PaginationMode.Pages];
    const strategy = this._injector.get(strategyType as any) as any;
    strategy.onActivate();
    this._cache[mode] = strategy;
    return strategy;
  }
}
