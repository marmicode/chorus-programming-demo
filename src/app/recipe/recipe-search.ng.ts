import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RecipeAddButton } from '../meal-planner/recipe-add-button.ng';
import { Catalog } from '../shared/catalog.ng';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form.ng';
import { Paginator } from './paginator.ng';
import { RecipePreview } from './recipe-preview.ng';
import { RecipeRepository } from './recipe-repository';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [Catalog, RecipeAddButton, RecipeFilterForm, RecipePreview, Paginator],
  template: `
    <wm-recipe-filter-form (filterChange)="filter.set($event); offset.set(0)" />
    <wm-catalog>
      @for (recipe of recipes.value()?.items ?? []; track recipe.id) {
      <wm-recipe-preview [recipe]="recipe">
        <wm-recipe-add-button [recipe]="recipe" />
      </wm-recipe-preview>
      }
    </wm-catalog>
    <wm-paginator
      [offset]="offset()"
      [limit]="limit"
      [total]="recipes.value()?.total ?? 0"
      (offsetChange)="offset.set($event)"
    />
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilter>({});
  offset = signal(0);
  limit = 5;
  recipes = rxResource({
    params: () => ({ filter: this.filter(), offset: this.offset() }),
    stream: ({ params }) =>
      this._recipeRepository.search(params.filter, {
        offset: params.offset,
        limit: this.limit,
      }),
  });

  private _recipeRepository = inject(RecipeRepository);
}
