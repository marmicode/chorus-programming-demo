import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { t } from '../testing/ng-test-utils';
import { Paginator } from './paginator.ng';

describe(Paginator.name, () => {
  it('disables previous on first page', async () => {
    const { previousButton } = await mountPaginator({
      offset: 0,
      limit: 5,
      total: 10,
    });

    await expect.element(previousButton).toBeDisabled();
  });

  it('disables next on last page', async () => {
    const { nextButton } = await mountPaginator({
      offset: 5,
      limit: 5,
      total: 10,
    });

    await expect.element(nextButton).toBeDisabled();
  });

  it('emits offsetChange when next is clicked', async () => {
    const { nextButton, offsetChange } = await mountPaginator({
      offset: 0,
      limit: 5,
      total: 10,
    });

    await nextButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });

  it('emits offsetChange when previous is clicked', async () => {
    const { previousButton, offsetChange } = await mountPaginator({
      offset: 5,
      limit: 5,
      total: 10,
    });

    await previousButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(0);
  });

  it.todo('navigates to next page with right arrow key', () => {
    // mount Paginator with offset: 0, limit: 5, total: 10 and capture offsetChange
    // press ArrowRight
    // assert offsetChange emits 5
  });

  it.todo('navigates to previous page with left arrow key', () => {
    // mount Paginator with offset: 5, limit: 5, total: 10 and capture offsetChange
    // press ArrowLeft
    // assert offsetChange emits 0
  });

  it.todo('ignores arrow keys when navigation is disabled', () => {
    // mount Paginator with offset: 0, limit: 5, total: 5 and capture offsetChange
    // press ArrowLeft and ArrowRight
    // assert offsetChange does not emit
  });

  it.todo('ignores arrow keys while typing in a form field', () => {
    // mount Paginator with offset: 0, limit: 5, total: 10 next to a text input and capture offsetChange
    // focus the input and press ArrowRight
    // assert offsetChange does not emit
  });
});

async function mountPaginator(inputs: {
  offset: number;
  limit: number;
  total: number;
}) {
  const offsetChange = vi.fn();

  await t.mount(Paginator, { inputs, outputs: { offsetChange } });

  return {
    offsetChange,
    previousButton: page.getByRole('button', { name: 'Previous' }),
    nextButton: page.getByRole('button', { name: 'Next' }),
  };
}
