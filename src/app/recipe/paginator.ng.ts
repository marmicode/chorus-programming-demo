import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  imports: [MatButtonModule],
  host: {
    role: 'group',
    'aria-label': 'Pagination',
    tabindex: '0',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <button
      mat-stroked-button
      [disabled]="offset() === 0"
      (click)="goPrevious()"
    >
      Previous
    </button>
    <button
      mat-stroked-button
      [disabled]="offset() + limit() >= total()"
      (click)="goNext()"
    >
      Next
    </button>
  `,
})
export class Paginator {
  limit = input.required<number>();
  total = input.required<number>();
  offset = model.required<number>();

  goPrevious() {
    this.offset.set(this.offset() - this.limit());
  }

  goNext() {
    this.offset.set(this.offset() + this.limit());
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' && this.offset() > 0) {
      event.preventDefault();
      this.goPrevious();
    } else if (
      event.key === 'ArrowRight' &&
      this.offset() + this.limit() < this.total()
    ) {
      event.preventDefault();
      this.goNext();
    }
  }
}
