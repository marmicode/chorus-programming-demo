import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  imports: [MatButtonModule],
  template: `
    <button
      matButton
      [disabled]="previousDisabled()"
      (click)="offsetChange.emit(offset() - limit())"
    >
      Previous
    </button>
    <button
      matButton
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
