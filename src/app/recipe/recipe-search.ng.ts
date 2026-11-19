import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { RecipeAddButton } from '../meal-planner/recipe-add-button.ng';
import { Catalog } from '../shared/catalog.ng';
import { Paginator } from '../shared/paginator.ng';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form.ng';
import { RecipePreview } from './recipe-preview.ng';
import { RecipeRepository } from './recipe-repository';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    Catalog,
    Paginator,
    RecipeAddButton,
    RecipeFilterForm,
    RecipePreview,
  ],
  template: `
    <wm-recipe-filter-form (filterChange)="filter.set($event)" />
    <wm-catalog>
      @for (recipe of recipes.value()?.items; track recipe.id) {
        <wm-recipe-preview [recipe]="recipe">
          <wm-recipe-add-button [recipe]="recipe" />
        </wm-recipe-preview>
      }
    </wm-catalog>
    @if (recipes.value(); as page) {
      <wm-paginator
        [offset]="offset()"
        [limit]="limit"
        [total]="page.total"
        (offsetChange)="offset.set($event)"
      />
    }
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilter>({});
  limit = 5;
  offset = linkedSignal<RecipeFilter, number>({
    source: this.filter,
    computation: () => 0,
  });
  recipes = rxResource({
    params: () => ({ filter: this.filter(), offset: this.offset() }),
    stream: ({ params }) =>
      this._recipeRepository.search({ ...params, limit: this.limit }),
  });

  private _recipeRepository = inject(RecipeRepository);
}
