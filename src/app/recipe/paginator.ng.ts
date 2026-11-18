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
  host: {
    '(document:keydown)': 'handleKeydown($event)',
  },
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

  protected handleKeydown(event: KeyboardEvent) {
    if (isEditable(event.target)) {
      return;
    }

    if (event.key === 'ArrowLeft' && !this.previousDisabled()) {
      this.offsetChange.emit(this.offset() - this.limit());
    } else if (event.key === 'ArrowRight' && !this.nextDisabled()) {
      this.offsetChange.emit(this.offset() + this.limit());
    }
  }

  protected previousDisabled = computed(() => this.offset() === 0);
  protected nextDisabled = computed(
    () => this.offset() + this.limit() >= this.total(),
  );
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}
