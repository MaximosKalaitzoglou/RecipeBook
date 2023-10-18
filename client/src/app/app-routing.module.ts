import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { authGuard } from './_guards/auth.guard';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { UsersComponent } from './users/users.component';
import { UserPageComponent } from './users/user-page/user-page.component';
import { RecipeCreateComponent } from './recipes/recipe-create/recipe-create.component';

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
        component: RecipeCreateComponent,
      },
      {
        path: 'recipes/:id/edit',
        component: RecipeEditComponent,
      },
      {
        path: 'recipes/:id',
        component: RecipeDetailComponent,
      },
    ],
  },
  {
    path: 'users',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    component: UsersComponent,
    children: [
      {
        path: ':username',
        component: UserPageComponent,
      },
    ],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
