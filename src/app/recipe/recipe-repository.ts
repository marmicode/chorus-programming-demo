import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { createRecipe, Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface RecipePage {
  items: Recipe[];
  total: number;
}

export interface RecipeSearchParams {
  filter?: RecipeFilter;
  offset?: number;
  limit?: number;
}

export interface RecipeRepositoryDef {
  search(params?: RecipeSearchParams): Observable<RecipePage>;
}

@Service()
export class RecipeRepository implements RecipeRepositoryDef {
  private _httpClient = inject(HttpClient);

  search({
    filter: { keywords, maxIngredientCount } = {},
    offset,
    limit,
  }: RecipeSearchParams = {}): Observable<RecipePage> {
    const params: ResponseListQueryParams = {
      embed: 'ingredients',
      ...(keywords ? { q: keywords } : {}),
      ...(offset != null ? { offset } : {}),
      ...(limit != null ? { limit } : {}),
    };

    return this._httpClient
      .get<RecipeListResponseDto>('https://recipe-api.marmicode.io/recipes', {
        params,
      })
      .pipe(
        map((response) => ({
          total: response.total,
          items: response.items
            .map((item) =>
              createRecipe({
                id: item.id,
                name: item.name,
                description: null,
                pictureUri: item.picture_uri,
                ingredients: item.ingredients ?? [],
                steps: [],
              })
            )
            /* Filter max ingredients locally meanwhile it is implemented server-side. */
            .filter((recipe) =>
              maxIngredientCount != null
                ? recipe.ingredients.length <= maxIngredientCount
                : true
            ),
        }))
      );
  }
}

type ResponseListQueryParams = {
  embed: 'ingredients' | 'steps' | 'ingredients,steps';
  q?: string;
  offset?: number;
  limit?: number;
};

interface RecipeListResponseDto {
  items: RecipeDto[];
  total: number;
}

interface RecipeDto {
  id: string;
  created_at: string;
  name: string;
  picture_uri: string;
  ingredients?: IngredientDto[];
}

interface IngredientDto {
  id: string;
  name: string;
}
