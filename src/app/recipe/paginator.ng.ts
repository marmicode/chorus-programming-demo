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
      mat-stroked-button
      [disabled]="!hasPrevious()"
      (click)="offsetChange.emit(offset() - limit())"
    >
      Previous
    </button>
    <button
      mat-stroked-button
      [disabled]="!hasNext()"
      (click)="offsetChange.emit(offset() + limit())"
    >
      Next
    </button>
  `,
  styles: `
    :host {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
  `,
})
export class Paginator {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();

  protected hasPrevious = computed(() => this.offset() > 0);
  protected hasNext = computed(
    () => this.offset() + this.limit() < this.total(),
  );
}
