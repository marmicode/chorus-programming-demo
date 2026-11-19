/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RecipeAddButton } from '../meal-planner/recipe-add-button.ng';
import { Catalog } from '../shared/catalog.ng';
import { InfiniteScrollDirective } from './pagination/infinite-scroll.directive';
import { PaginationEngineService } from './pagination/pagination-engine.service';
import { PaginationEventBusService } from './pagination/pagination-event-bus.service';
import { PaginationPreferencesService } from './pagination/pagination-preferences.service';
import { PaginationWizardComponent } from './pagination/pagination-wizard.component';
import { PaginatorComponent } from './pagination/paginator.component';
import {
  DEFAULT_ITEMS_PER_PAGE,
  ENABLE_PAGINATION_WIZARD,
} from './pagination/pagination.constants';
import {
  PaginationEventTypes,
  PaginationMode,
} from './pagination/pagination.models';
import { log } from './pagination/pagination.utils';
import { Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form.ng';
import { RecipePreview } from './recipe-preview.ng';
import { RecipeRepository } from './recipe-repository';

@Component({
  // FIXME: OnPush disabled because the paginator wasn't updating
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    Catalog,
    InfiniteScrollDirective,
    MatButtonModule,
    PaginationWizardComponent,
    PaginatorComponent,
    RecipeAddButton,
    RecipeFilterForm,
    RecipePreview,
  ],
  template: `
    @if (showWizard()) {
      <wm-pagination-wizard
        (completed)="onWizardCompleted($event)"
        (dismissed)="onWizardDismissed()"
      />
    }

    <wm-recipe-filter-form (filterChange)="onFilterChange($event)" />

    <div class="pagination-toolbar">
      <span class="pagination-toolbar__mode">{{ modeLabel() }}</span>
      <button mat-button type="button" (click)="resetPagination()">
        ⚙️ Pagination settings
      </button>
    </div>

    @if (
      isPagesMode() &&
      (paginatorPosition() === 'top' || paginatorPosition() === 'both')
    ) {
      <wm-paginator
        [currentPage]="engine.currentPage()"
        [totalPages]="engine.totalPages()"
        [totalItems]="engine.totalItems()"
        [hasNext]="engine.hasNext()"
        [hasPrevious]="engine.hasPrevious()"
        [showPageNumbers]="prefs.showPageNumbers()"
        [compact]="paginatorPosition() === 'both'"
      />
    }

    @if (isLoading()) {
      <p class="loading">Loading recipes...</p>
    }

    <wm-catalog>
      @for (recipe of displayedRecipes(); track $index) {
        <wm-recipe-preview [recipe]="recipe">
          <wm-recipe-add-button [recipe]="recipe" />
        </wm-recipe-preview>
      }
    </wm-catalog>

    @if (
      isPagesMode() &&
      (paginatorPosition() === 'bottom' || paginatorPosition() === 'both')
    ) {
      <wm-paginator
        [currentPage]="engine.currentPage()"
        [totalPages]="engine.totalPages()"
        [totalItems]="engine.totalItems()"
        [hasNext]="engine.hasNext()"
        [hasPrevious]="engine.hasPrevious()"
        [showPageNumbers]="prefs.showPageNumbers()"
        [compact]="paginatorPosition() === 'both'"
      />
    }

    @if (!isPagesMode()) {
      <div
        wmInfiniteScroll
        [wmInfiniteScrollDisabled]="!engine.hasNext() || isLoading()"
        [wmInfiniteScrollThreshold]="prefs.scrollThreshold()"
        (wmInfiniteScroll)="engine.loadMore()"
      ></div>
      @if (engine.isLoadingMore()) {
        <p class="loading">Loading more recipes...</p>
      }
      @if (!engine.hasNext() && displayedRecipes().length > 0) {
        <p class="end-of-list">🎉 You've reached the end!</p>
      }
    }
  `,
  styles: `
    .pagination-toolbar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      color: #666;
      font-size: 13px;
    }

    .loading,
    .end-of-list {
      text-align: center;
      color: #666;
      padding: 16px;
    }
  `,
})
export class RecipeSearch implements OnInit {
  filter = signal<RecipeFilter>({});
  recipes = signal<Recipe[]>([]);
  isLoading = signal(false);
  showWizard = signal(false);
  displayedRecipes = signal<any[]>([]);

  engine = inject(PaginationEngineService);
  prefs = inject(PaginationPreferencesService);

  isPagesMode = computed(() => this.prefs.mode() === PaginationMode.Pages);
  paginatorPosition = computed(() => this.prefs.paginatorPosition());
  modeLabel = computed(() =>
    this.isPagesMode()
      ? `📄 ${this.prefs.itemsPerPage()} recipes per page`
      : `♾️ Loading ${this.prefs.itemsPerPage()} recipes at a time`,
  );

  private _recipeRepository = inject(RecipeRepository);
  private _eventBus = inject(PaginationEventBusService);
  private _cdr = inject(ChangeDetectorRef);

  constructor() {
    /* Fetch recipes whenever the filter changes. */
    effect(() => {
      const filter = this.filter();
      log('fetching recipes', filter);
      this.isLoading.set(true);
      this._recipeRepository.search({ filter }).subscribe({
        next: ({ items }) => {
          this.recipes.set(items);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.isLoading.set(false);
        },
      });
    });

    effect(() => {
      this.engine.setItems(this.recipes());
    });

    effect(() => {
      this.displayedRecipes.set(this.engine.visibleItems());
    });

    effect(() => {
      if (ENABLE_PAGINATION_WIZARD && !this.prefs.hasCompletedWizard()) {
        this.showWizard.set(true);
      }
    });
  }

  ngOnInit() {
    this._eventBus
      .on(PaginationEventTypes.WIZARD_COMPLETED)
      .subscribe(() => this.showWizard.set(false));

    this._eventBus.events$.subscribe((event) => {
      if (
        [
          PaginationEventTypes.NEXT_PAGE,
          PaginationEventTypes.PREV_PAGE,
          PaginationEventTypes.FIRST_PAGE,
          PaginationEventTypes.LAST_PAGE,
          PaginationEventTypes.PAGE_CHANGE,
        ].includes(event.type)
      ) {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this._cdr.detectChanges();
        }, 0);
      }
    });
  }

  onFilterChange(filter: RecipeFilter) {
    this.filter.set(filter);
    this.engine.goToPage(1);
    this._eventBus.emit(
      PaginationEventTypes.FILTER_CHANGED,
      filter,
      'RecipeSearch',
    );
  }

  onWizardCompleted(prefs: any) {
    log('wizard completed', prefs);
    this.showWizard.set(false);
  }

  onWizardDismissed() {
    this.showWizard.set(false);
    /* Apply defaults so that we don't nag the user again during this session. */
    this.prefs.save(
      { mode: PaginationMode.Pages, itemsPerPage: DEFAULT_ITEMS_PER_PAGE },
      false,
    );
  }

  resetPagination() {
    if (confirm('Reset your pagination preferences? The page will reload.')) {
      this.prefs.reset();
      window.location.reload();
    }
  }
}
