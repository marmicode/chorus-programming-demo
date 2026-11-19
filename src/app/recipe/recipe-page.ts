import { Recipe } from './recipe';

export interface RecipePage {
  items: Recipe[];
  total: number;
}

export function createRecipePage(page: RecipePage): RecipePage {
  return page;
}
