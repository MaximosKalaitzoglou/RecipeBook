import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeService } from './_services/recipe.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './_shared/shared.module';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { HomepageComponent } from './homepage/homepage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { RecipeFooterComponent } from './recipes/recipe-list/recipe-item/recipe-footer/recipe-footer.component';
import { RecipeHeaderComponent } from './recipes/recipe-list/recipe-item/recipe-header/recipe-header.component';
import { UsersComponent } from './users/users.component';
import { UserPageComponent } from './users/user-page/user-page.component';
import { MemberService } from './_services/member.service';
import { UserRecipeCardComponent } from './users/user-page/user-recipe-card/user-recipe-card.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RecipeCreateComponent } from './recipes/recipe-create/recipe-create.component';
import { RecipeFormComponent } from './recipes/recipe-form/recipe-form.component';
import { RecipeCardComponent } from './recipes/recipe-card/recipe-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeItemComponent,
    RecipeEditComponent,
    HomepageComponent,
    RegisterComponent,
    NotFoundComponent,
    ServerErrorComponent,
    RecipeFooterComponent,
    RecipeHeaderComponent,
    UsersComponent,
    UserPageComponent,
    UserRecipeCardComponent,
    RecipeCreateComponent,
    RecipeFormComponent,
    RecipeCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
  ],
  providers: [
    RecipeService,
    MemberService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
