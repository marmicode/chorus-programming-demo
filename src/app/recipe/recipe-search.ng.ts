import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  imports: [
    Catalog,
    RecipeAddButton,
    RecipeFilterForm,
    RecipePreview,
    Paginator,
  ],
  template: `
    <wm-recipe-filter-form (filterChange)="onFilterChange($event)" />
    <wm-catalog>
      @for (recipe of items(); track recipe.id) {
        <wm-recipe-preview [recipe]="recipe">
          <wm-recipe-add-button [recipe]="recipe" />
        </wm-recipe-preview>
      }
    </wm-catalog>
    <wm-paginator
      [offset]="offset()"
      [limit]="limit"
      [total]="total()"
      (offsetChange)="offset.set($event)"
    />
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilter>({});
  offset = signal(5);
  limit = 5;
  recipes = rxResource({
    params: () => ({ filter: this.filter(), offset: this.offset() }),
    stream: ({ params }) =>
      fetchRecipes(this._recipeRepository, {
        filter: params.filter,
        offset: params.offset,
        limit: this.limit,
      }),
  });
  items = computed(() => this.recipes.value()?.items ?? []);
  total = computed(() => this.recipes.value()?.total ?? 0);

  onFilterChange(filter: RecipeFilter) {
    this.filter.set(filter);
    this.offset.set(0);
  }

  private _recipeRepository = inject(RecipeRepository);
}

function fetchRecipes(
  repository: RecipeRepository,
  {
    filter,
    offset,
    limit,
  }: { filter: RecipeFilter; offset: number; limit: number },
) {
  return repository.search(filter, { offset, limit });
}
