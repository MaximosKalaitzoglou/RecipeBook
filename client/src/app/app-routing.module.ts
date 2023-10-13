import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { authGuard } from './_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'recipes',
        component: RecipeListComponent,
      },
      {
        path: 'recipes/new',
        pathMatch: 'full',
        component: RecipeEditComponent,
      },
      {
        path: 'recipes/:id',
        component: RecipeDetailComponent,
      },

      {
        path: 'recipes/:id/edit',
        component: RecipeEditComponent,
      },
    ],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'shopping-list',
    component: ShoppingListComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
