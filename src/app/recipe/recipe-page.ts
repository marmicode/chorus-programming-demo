import { Recipe } from './recipe';

/**
 * @deprecated 🚧 work in progress
 */
export interface RecipePage {
  items: Recipe[];
  total: number;
}

/**
 * @deprecated 🚧 work in progress
 */
export interface RecipePagination {
  offset?: number;
  limit?: number;
}
