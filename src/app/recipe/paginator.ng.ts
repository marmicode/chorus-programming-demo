import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  template: `
    <button (click)="offsetChange.emit(offset() - limit())" [disabled]="offset() === 0">Previous</button>
    <button (click)="offsetChange.emit(offset() + limit())" [disabled]="offset() + limit() >= total()">Next</button>
  `,
})
export class Paginator {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();
}
