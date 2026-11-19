import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { createRecipe, Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface RecipeRepositoryDef {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search(filter: RecipeFilter, pagination?: any): Observable<Recipe[]>;
}

@Service()
export class RecipeRepository implements RecipeRepositoryDef {
  private _httpClient = inject(HttpClient);

  search(
    { keywords, maxIngredientCount }: RecipeFilter = {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pagination?: any,
  ): Observable<Recipe[]> {
    const params: ResponseListQueryParams = {
      embed: 'ingredients',
      ...(keywords ? { q: keywords } : {}),
      /* Not used yet: we paginate client-side for now (see PaginationEngineService). */
      ...(pagination?.page
        ? {
            _page: pagination.page,
            _per_page: pagination.perPage ?? pagination.size ?? 5,
          }
        : {}),
    };

    return this._httpClient
      .get<RecipeListResponseDto>('https://recipe-api.marmicode.io/recipes', {
        params,
      })
      .pipe(
        map((response) =>
          response.items
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
            )
        )
      );
  }
}

type ResponseListQueryParams = {
  embed: 'ingredients' | 'steps' | 'ingredients,steps';
  q?: string;
  _page?: number;
  _per_page?: number;
};

interface RecipeListResponseDto {
  items: RecipeDto[];
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
