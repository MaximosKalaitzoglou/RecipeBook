import { Injectable } from '@angular/core';
import { Subject, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Recipe } from '../_models/recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  apiUrl = environment.apiUrl;

  recipesChanged = new Subject<Recipe[]>();

  redirectEvent = new Subject<Boolean>();

  constructor(private http: HttpClient) {}

  getRecipes() {
    if (this.recipes.length > 0) return of(this.recipes);
    return this.http.get<Recipe[]>(this.apiUrl + 'recipes/list/', {}).pipe(
      map((recipes) => {
        this.recipes = recipes;
        return recipes;
      })
    );
  }

  getRecipeById(id: number) {
    const recipe = this.recipes.find((rec) => rec.id === id);
    // console.log(recipe);
    if (recipe) return of(recipe);
    return this.http.get<Recipe>(this.apiUrl + 'recipes/' + id);
  }

  addRecipe(recipe: Recipe) {
    this.http
      .post<Recipe>(
        this.apiUrl + 'recipes/save-recipe',
        recipe,
        this.getHttpOptions()
      )
      .subscribe({
        next: (response: Recipe) => {
          response.appUserPhotoUrl = recipe.appUserPhotoUrl;
          this.recipes.push(response);
          this.redirectEvent.next(true);
        },
      });
  }

  updateRecipe(idx: number, recipe: Recipe) {
    this.http
      .put(this.apiUrl + 'recipes/' + recipe.id, recipe, this.getHttpOptions())
      .subscribe({
        next: (response) => {
          this.recipes = this.recipes.map((rec) => {
            if (rec.id === idx) {
              rec = recipe;
            }
            return rec;
          });
          this.recipesChanged.next(this.recipes);
          this.redirectEvent.next(true);
        },
      });
  }

  deleteRecipe(id: number) {
    this.http
      .delete(this.apiUrl + 'recipes/' + id, this.getHttpOptions())
      .subscribe({
        next: (response) => {
          // console.log(response);
          this.recipes = this.recipes.filter((rec, i) => rec.id !== id);
          this.recipesChanged.next(this.recipes.slice());
          this.redirectEvent.next(true);
        },
      });
  }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token,
      }),
    };
  }
}
