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
  selector: 'wm-offset-paginator',
  imports: [MatButtonModule],
  template: `
    <button
      mat-stroked-button
      type="button"
      [disabled]="isPreviousDisabled()"
      (click)="offsetChange.emit(offset() - limit())"
    >
      Previous
    </button>
    <button
      mat-stroked-button
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
      gap: 8px;
      justify-content: center;
      margin: 16px 0;
    }
  `,
})
export class Paginator {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();

  protected isPreviousDisabled = computed(() => this.offset() === 0);
  protected isNextDisabled = computed(
    () => this.offset() + this.limit() >= this.total(),
  );
}
