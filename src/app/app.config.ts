import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe/recipe-repository.fake';
import { RECIPES } from './recipe/recipe-data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideZonelessChangeDetection(),
    provideRecipeRepositoryFake(),
    provideAppInitializer(() => {
      const fake = inject(RecipeRepositoryFake);
      fake.setRecipes(RECIPES);
    }),
  ],
};
