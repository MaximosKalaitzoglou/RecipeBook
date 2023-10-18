import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Recipe } from '../_models/recipe';
import { Like } from '../_models/like';

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
    return this.http
      .get<Recipe[]>(this.apiUrl + 'recipes/list/', this.getHttpOptions())
      .pipe(
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
    return this.http.get<Recipe>(
      this.apiUrl + 'recipes/' + id,
      this.getHttpOptions()
    );
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
      .put(this.apiUrl + 'recipes/' + idx, recipe, this.getHttpOptions())
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

  likeRecipe(likeRequest: { userName: string; recipeId: number }) {
    this.http
      .post<Like>(this.apiUrl + 'like', likeRequest, this.getHttpOptions())
      .pipe(
        tap((like) => {
          var recipe = this.recipes.find((r) => r.id === likeRequest.recipeId);
          if (like !== null && recipe) {
            recipe.likes.push(like);
            recipe.likeCount++;
          }
        }),
        catchError((error) => {
          console.log('Error liking recipe');
          throw error;
        })
      )
      .subscribe({
        next: (response) => {},
      });
  }

  unlikeRecipe(likeRequest: { userName: string; recipeId: number }) {
    const url =
      this.apiUrl +
      `like?username=${likeRequest.userName}&recipeId=${likeRequest.recipeId}`;

    this.http
      .delete(url, this.getHttpOptions())
      .pipe(
        tap(() => {
          const recipe = this.recipes.find(
            (r) => r.id === likeRequest.recipeId
          );
          if (recipe?.likes && recipe.likeCount) {
            recipe.likes = recipe.likes.filter(
              (l) => l.userName !== likeRequest.userName
            );
            recipe.likeCount--;
          }
        }),
        catchError((error) => {
          // Handle errors, e.g., show an error message
          console.error('Error unliking recipe:', error);
          throw error;
        })
      )
      .subscribe({
        next: (_) => {},
      });
  }
}
