import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
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

  it('emits offsetChange when right arrow is pressed', async () => {
    const { offsetChange } = await mountPaginator({
      offset: 0,
      limit: 5,
      total: 10,
    });

    await page.getByRole('group', { name: 'Pagination' }).click();
    await userEvent.keyboard('{ArrowRight}');

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });

  it('emits offsetChange when left arrow is pressed', async () => {
    const { offsetChange } = await mountPaginator({
      offset: 5,
      limit: 5,
      total: 10,
    });

    await page.getByRole('group', { name: 'Pagination' }).click();
    await userEvent.keyboard('{ArrowLeft}');

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(0);
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
