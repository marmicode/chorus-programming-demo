import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  template: `
    <button
      [disabled]="offset() === 0"
      (click)="offset.set(offset() - limit())"
    >Previous</button>
    <button
      [disabled]="offset() + limit() >= total()"
      (click)="offset.set(offset() + limit())"
    >Next</button>
  `,
})
export class Paginator {
  offset = model.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
}
