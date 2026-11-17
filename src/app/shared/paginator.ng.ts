import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  template: `
    <button
      type="button"
      [disabled]="isPreviousDisabled()"
      (click)="offsetChange.emit(offset() - limit())"
    >
      Previous
    </button>
    <button
      type="button"
      [disabled]="isNextDisabled()"
      (click)="offsetChange.emit(offset() + limit())"
    >
      Next
    </button>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      gap: 1em;
    }
  `,
})
export class Paginator {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();

  isPreviousDisabled = computed(() => this.offset() === 0);
  isNextDisabled = computed(() => this.offset() + this.limit() >= this.total());
}
