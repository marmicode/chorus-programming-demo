/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PaginationEventBusService } from './pagination-event-bus.service';
import { MAX_VISIBLE_PAGE_NUMBERS, PAGE_ELLIPSIS } from './pagination.constants';
import { PaginationEventTypes } from './pagination.models';
import { log, range, toNumber } from './pagination.utils';

@Component({
  selector: 'wm-paginator',
  imports: [FormsModule, MatButtonModule],
  template: `
    <div class="paginator" [class.paginator--compact]="compact">
      <button
        mat-button
        type="button"
        [disabled]="!hasPrevious"
        (click)="first()"
      >
        « First
      </button>
      <button
        mat-stroked-button
        type="button"
        [disabled]="!hasPrevious"
        (click)="previous()"
      >
        ‹ Previous
      </button>

      @if (showPageNumbers) {
        @for (page of getPages(); track $index) {
          <button
            mat-button
            type="button"
            class="paginator__page"
            [class.paginator__page--active]="page === currentPage"
            [attr.aria-current]="page === currentPage ? 'page' : null"
            [disabled]="page === PAGE_ELLIPSIS"
            (click)="goTo(page)"
          >
            {{ page === PAGE_ELLIPSIS ? '…' : page }}
          </button>
        }
      }

      <button
        mat-stroked-button
        type="button"
        [disabled]="!hasNext"
        (click)="next()"
      >
        Next ›
      </button>
      <button mat-button type="button" [disabled]="!hasNext" (click)="last()">
        Last »
      </button>
    </div>

    <div class="paginator__info">
      <span
        >Page {{ currentPage }} of {{ totalPages }} ({{ totalItems }}
        recipes)</span
      >
      <input
        class="paginator__jump"
        type="number"
        placeholder="Go to page..."
        [(ngModel)]="jumpTo"
        (keyup.enter)="jump()"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
      text-align: center;
      margin: 16px 0;
    }

    .paginator {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
      align-items: center;
    }

    .paginator--compact button {
      min-width: 0 !important;
      padding: 0 6px !important;
    }

    .paginator__page--active {
      background: #380030 !important;
      color: white !important;
      font-weight: bold;
    }

    .paginator__info {
      margin-top: 8px;
      color: #666;
      font-size: 13px;
    }

    .paginator__jump {
      margin-left: 12px;
      width: 100px;
    }
  `,
})
export class PaginatorComponent implements OnChanges {
  @Input() currentPage: any = 1;
  @Input() totalPages: any = 1;
  @Input() totalItems = 0;
  @Input() hasNext = false;
  @Input() hasPrevious = false;
  @Input() showPageNumbers = true;
  @Input() compact = false;

  /* Kept for backward compatibility. */
  @Output() pageChange = new EventEmitter<number>();

  PAGE_ELLIPSIS = PAGE_ELLIPSIS;
  jumpTo: any = null;

  private _eventBus = inject(PaginationEventBusService);

  ngOnChanges(changes: SimpleChanges) {
    log('paginator changes', changes);
    if (changes['currentPage']) {
      this.jumpTo = null;
    }
  }

  getPages(): number[] {
    const total = toNumber(this.totalPages);
    const current = toNumber(this.currentPage);

    if (total <= MAX_VISIBLE_PAGE_NUMBERS + 2) {
      return range(1, total);
    }

    const half = Math.floor(MAX_VISIBLE_PAGE_NUMBERS / 2);
    let start = Math.max(2, current - half + 1);
    let end = Math.min(total - 1, current + half - 1);

    if (current <= half + 1) {
      start = 2;
      end = MAX_VISIBLE_PAGE_NUMBERS - 1;
    }
    if (current >= total - half) {
      start = total - MAX_VISIBLE_PAGE_NUMBERS + 2;
      end = total - 1;
    }

    const pages = [1];
    if (start > 2) {
      pages.push(PAGE_ELLIPSIS);
    }
    pages.push(...range(start, end));
    if (end < total - 1) {
      pages.push(PAGE_ELLIPSIS);
    }
    pages.push(total);
    return pages;
  }

  first() {
    this._eventBus.emit(PaginationEventTypes.FIRST_PAGE, undefined, 'PaginatorComponent');
    this.pageChange.emit(1);
  }

  previous() {
    this._eventBus.emit(PaginationEventTypes.PREV_PAGE, undefined, 'PaginatorComponent');
    this.pageChange.emit(toNumber(this.currentPage) - 1);
  }

  next() {
    this._eventBus.emit(PaginationEventTypes.NEXT_PAGE, undefined, 'PaginatorComponent');
    this.pageChange.emit(toNumber(this.currentPage) + 1);
  }

  last() {
    this._eventBus.emit(PaginationEventTypes.LAST_PAGE, undefined, 'PaginatorComponent');
    this.pageChange.emit(toNumber(this.totalPages));
  }

  goTo(page: number) {
    if (page === PAGE_ELLIPSIS) {
      return;
    }
    this._eventBus.emit(PaginationEventTypes.PAGE_CHANGE, page, 'PaginatorComponent');
    this.pageChange.emit(page);
  }

  jump() {
    this.goTo(toNumber(this.jumpTo));
  }
}
