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
      [disabled]="previousDisabled()"
      (click)="offsetChange.emit(offset() - limit())"
    >
      Previous
    </button>
    <button
      type="button"
      [disabled]="nextDisabled()"
      (click)="offsetChange.emit(offset() + limit())"
    >
      Next
    </button>
  `,
})
export class Paginator {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();

  protected previousDisabled = computed(() => this.offset() === 0);
  protected nextDisabled = computed(
    () => this.offset() + this.limit() >= this.total(),
  );
}
