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
      type="button"
      [disabled]="previousDisabled()"
      (click)="offsetChange.emit(offset() - limit())"
    >
      Previous
    </button>
    <button
      matButton
      type="button"
      [disabled]="nextDisabled()"
      (click)="offsetChange.emit(offset() + limit())"
    >
      Next
    </button>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      gap: 10px;
    }
  `,
})
export class Paginator {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();

  previousDisabled = computed(() => this.offset() === 0);
  nextDisabled = computed(() => this.offset() + this.limit() >= this.total());
}
