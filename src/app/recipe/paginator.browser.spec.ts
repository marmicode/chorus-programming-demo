import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { t } from '../testing/ng-test-utils';
import { Paginator } from './paginator.ng';

describe(Paginator.name, () => {
  it.todo('disables previous on first page', async () => {
    const { previousButton } = await mountPaginator({ offset: 0 });

    await expect.element(previousButton).toBeDisabled();
  });

  it.todo('disables next on last page', async () => {
    const { nextButton } = await mountPaginator({ offset: 5 });

    await expect.element(nextButton).toBeDisabled();
  });

  it.todo('emits offsetChange when next is clicked', async () => {
    const { nextButton, offsetChange } = await mountPaginator({ offset: 0 });

    await nextButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });

  it.todo('emits offsetChange when previous is clicked', async () => {
    const { previousButton, offsetChange } = await mountPaginator({
      offset: 5,
    });

    await previousButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(0);
  });
});

async function mountPaginator({ offset }: { offset: number }) {
  const offsetChange = vi.fn();

  await t.mount(Paginator, {
    inputs: { offset, limit: 5, total: 10 },
    outputs: { offsetChange },
  });

  return {
    offsetChange,
    previousButton: page.getByRole('button', { name: 'Previous' }),
    nextButton: page.getByRole('button', { name: 'Next' }),
  };
}
