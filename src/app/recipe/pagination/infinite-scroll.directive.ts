/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Directive,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PaginationEventBusService } from './pagination-event-bus.service';
import {
  INFINITE_SCROLL_DEBOUNCE_MS,
  INFINITE_SCROLL_SAFETY_NET_INTERVAL_MS,
  INFINITE_SCROLL_THRESHOLD_PX,
} from './pagination.constants';
import { PaginationEventTypes } from './pagination.models';
import { debounce, log, toNumber } from './pagination.utils';

@Directive({
  selector: '[wmInfiniteScroll]',
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() wmInfiniteScrollDisabled = false;
  @Input() wmInfiniteScrollThreshold: any = INFINITE_SCROLL_THRESHOLD_PX;
  @Output() wmInfiniteScroll = new EventEmitter<void>();

  private _eventBus = inject(PaginationEventBusService);

  ngOnInit() {
    window.addEventListener(
      'scroll',
      debounce(() => this._onScroll(), INFINITE_SCROLL_DEBOUNCE_MS),
    );

    /* Check once in case the page is not scrollable yet. */
    setTimeout(() => this._onScroll(), 500);

    /* Safety net in case scroll events are missed. */
    setInterval(() => this._onScroll(), INFINITE_SCROLL_SAFETY_NET_INTERVAL_MS);
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy() {
    // TODO: remove the scroll listener
  }

  private _onScroll() {
    if (this.wmInfiniteScrollDisabled) {
      return;
    }

    const distanceFromBottom =
      document.documentElement.scrollHeight -
      (window.innerHeight + window.scrollY);

    if (distanceFromBottom < toNumber(this.wmInfiniteScrollThreshold)) {
      log('infinite scroll triggered', { distanceFromBottom });
      this.wmInfiniteScroll.emit();
      this._eventBus.emit(
        PaginationEventTypes.LOAD_MORE,
        null,
        'InfiniteScrollDirective',
      );
    }
  }
}
