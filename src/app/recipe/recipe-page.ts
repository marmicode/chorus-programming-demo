import { Recipe } from './recipe';

export interface RecipePage {
  items: Recipe[];
  total: number;
}

export interface RecipePagination {
  offset?: number;
  limit?: number;
}
