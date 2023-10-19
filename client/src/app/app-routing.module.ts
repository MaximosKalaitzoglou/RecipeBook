import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { authGuard } from './_guards/auth.guard';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { UsersComponent } from './users/users.component';
import { UserPageComponent } from './users/user-page/user-page.component';
import { UnauthorizedComponent } from './errors/unauthorized/unauthorized.component';
import { routeParamsGuard } from './_guards/route-params.guard';
import { LeaveGuard } from './_guards/leave-page.guard';
import { RecipeFormComponent } from './recipes/recipe-form/recipe-form.component';

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
        component: RecipeFormComponent,
        canDeactivate: [LeaveGuard],
      },
      {
        path: 'recipes/:id/edit',
        canActivate: [routeParamsGuard],
        canDeactivate: [LeaveGuard],
        component: RecipeFormComponent,
      },
      {
        path: 'recipes/:id',
        canActivate: [routeParamsGuard],
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
    path: 'not-authorized',
    component: UnauthorizedComponent,
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
