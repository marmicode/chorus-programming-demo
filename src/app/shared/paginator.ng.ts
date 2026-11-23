import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
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
      type="button"
      [disabled]="isPreviousDisabled()"
      (click)="goToPrevious()"
    >
      Previous
    </button>
    <button
      matButton
      type="button"
      [disabled]="isNextDisabled()"
      (click)="goToNext()"
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
  offset = model.required<number>();
  limit = input.required<number>();
  total = input.required<number>();

  isPreviousDisabled = computed(() => this.offset() === 0);
  isNextDisabled = computed(() => this.offset() + this.limit() >= this.total());

  protected handleKeydown(event: KeyboardEvent) {
    if (isEditable(event.target)) {
      return;
    }

    if (event.key === 'ArrowLeft' && !this.isPreviousDisabled()) {
      this.goToPrevious();
    } else if (event.key === 'ArrowRight' && !this.isNextDisabled()) {
      this.goToNext();
    }
  }

  protected goToPrevious() {
    this.offset.set(this.offset() - this.limit());
  }

  protected goToNext() {
    this.offset.set(this.offset() + this.limit());
  }
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}
