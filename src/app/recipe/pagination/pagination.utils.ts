/* eslint-disable @typescript-eslint/no-explicit-any */
import { PAGINATION_DEBUG } from './pagination.constants';

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function range(start: number, end: number): number[] {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

export function debounce(fn: any, ms: number) {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}

export function toNumber(value: any): number {
  return parseInt(value);
}

export function isEmpty(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
}

export function log(...args: any[]) {
  if (PAGINATION_DEBUG) {
    console.log('[Pagination]', ...args);
  }
}
