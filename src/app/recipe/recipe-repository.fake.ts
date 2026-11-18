import { Provider, Service } from '@angular/core';
import { Recipe } from './recipe';
import { defer, Observable } from 'rxjs';
import {
  RecipePage,
  RecipeRepository,
  RecipeRepositoryDef,
  RecipeSearchParams,
} from './recipe-repository';

@Service()
export class RecipeRepositoryFake implements RecipeRepositoryDef {
  private _pauseGate = new PauseGate();
  private _recipes: Recipe[] = [];

  search({
    keywords,
    maxIngredientCount,
    maxStepCount,
    offset = 0,
    limit,
  }: RecipeSearchParams = {}): Observable<RecipePage> {
    return defer(async () => {
      await this._pauseGate.whenResumed;
      const recipes = this._recipes.filter((recipe) => {
        const conditions = [
          /* Filter by keywords. */
          () => (keywords ? recipe.name.includes(keywords) : true),
          /* Filter by max ingredients. */
          () =>
            maxIngredientCount != null
              ? recipe.ingredients.length <= maxIngredientCount
              : true,
          /* Filter by max steps. */
          () =>
            maxStepCount != null ? recipe.steps.length <= maxStepCount : true,
        ];

        /* Return true if all conditions are true. */
        return conditions.every((condition) => condition());
      });
      return {
        items: recipes.slice(
          offset,
          limit != null ? offset + limit : undefined,
        ),
        total: recipes.length,
      };
    });
  }

  setRecipes(recipes: Recipe[]) {
    this._recipes = recipes;
  }

  pause() {
    this._pauseGate.pause();
  }
}

class PauseGate {
  private _whenResumed = Promise.resolve();
  private _resolveWhenResumed?: () => void;

  get whenResumed() {
    return this._whenResumed;
  }

  pause() {
    this._whenResumed = new Promise(
      (resolve) => (this._resolveWhenResumed = resolve),
    );
  }

  resume() {
    this._resolveWhenResumed?.();
  }
}

export function provideRecipeRepositoryFake(): Provider[] {
  return [
    RecipeRepositoryFake,
    {
      provide: RecipeRepository,
      useExisting: RecipeRepositoryFake,
    },
  ];
}
