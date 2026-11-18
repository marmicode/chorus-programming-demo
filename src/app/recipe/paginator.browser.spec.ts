import { Component, input, output } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { t } from '../testing/ng-test-utils';
import { Paginator } from './paginator.ng';

@Component({
  selector: 'wm-paginator-with-input',
  imports: [Paginator],
  template: `
    <input type="text" />
    <wm-paginator
      [offset]="offset()"
      [limit]="limit()"
      [total]="total()"
      (offsetChange)="offsetChange.emit($event)"
    />
  `,
})
class PaginatorWithInput {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();
}

describe(Paginator.name, () => {
  it('disables previous on first page', async () => {
    const { previousButton } = await mountPaginator({ offset: 0 });

    await expect.element(previousButton).toBeDisabled();
  });

  it('disables next on last page', async () => {
    const { nextButton } = await mountPaginator({ offset: 5 });

    await expect.element(nextButton).toBeDisabled();
  });

  it('emits offsetChange when next is clicked', async () => {
    const { nextButton, offsetChange } = await mountPaginator({ offset: 0 });

    await nextButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });

  it('emits offsetChange when previous is clicked', async () => {
    const { previousButton, offsetChange } = await mountPaginator({
      offset: 5,
    });

    await previousButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(0);
  });

  it('navigates to next page with right arrow key', async () => {
    const { offsetChange } = await mountPaginator({ offset: 0 });

    await userEvent.keyboard('{ArrowRight}');

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });

  it('navigates to previous page with left arrow key', async () => {
    const { offsetChange } = await mountPaginator({ offset: 5 });

    await userEvent.keyboard('{ArrowLeft}');

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(0);
  });

  it('ignores arrow keys when navigation is disabled', async () => {
    const { offsetChange } = await mountPaginator({ offset: 0, total: 5 });

    await userEvent.keyboard('{ArrowLeft}{ArrowRight}');

    expect(offsetChange).not.toHaveBeenCalled();
  });

  it('ignores arrow keys while typing in a form field', async () => {
    const offsetChange = vi.fn();
    await t.mount(PaginatorWithInput, {
      inputs: { offset: 0, limit: 5, total: 10 },
      outputs: { offsetChange },
    });

    await page.getByRole('textbox').click();
    await userEvent.keyboard('{ArrowRight}');

    expect(offsetChange).not.toHaveBeenCalled();
  });
});

async function mountPaginator({
  offset,
  total = 10,
}: {
  offset: number;
  total?: number;
}) {
  const offsetChange = vi.fn();

  await t.mount(Paginator, {
    inputs: { offset, limit: 5, total },
    outputs: { offsetChange },
  });

  return {
    offsetChange,
    previousButton: page.getByRole('button', { name: 'Previous' }),
    nextButton: page.getByRole('button', { name: 'Next' }),
  };
}
