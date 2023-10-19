import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Recipe } from '../_models/recipe';
import { Like } from '../_models/like';
import { AccountService } from './account.service';
import { Comment } from '../_models/comment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  apiUrl = environment.apiUrl;

  recipesChanged = new Subject<Recipe[]>();

  likeAdded = new Subject<{ likeObj: Like; recipeId: number }>();
  likeRemoved = new Subject<{ userName: string; recipeId: number }>();

  commentAdded = new Subject<{ com: Comment; recipeId: number }>();
  commentDeleted = new Subject<{
    userName: string;
    recipeId: number;
    commentId: number;
  }>();

  redirectEvent = new Subject<Boolean>();

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.likeAdded.subscribe({
      next: (like) => {
        var recipe = this.recipes.find((r) => r.id === like.recipeId);
        if (like !== null && recipe) {
          recipe.likes.push(like.likeObj);
          recipe.likeCount++;
          recipe.hasLiked = true;
        }
      },
    });

    this.likeRemoved.subscribe({
      next: (response) => {
        const recipe = this.recipes.find((r) => r.id === response.recipeId);
        if (recipe?.likes && recipe.likeCount) {
          recipe.likes = recipe.likes.filter(
            (l) => l.userName !== response.userName
          );
          recipe.likeCount--;
          recipe.hasLiked = false;
        }
      },
    });

    this.commentAdded.subscribe({
      next: (comment) => {
        var recipe = this.recipes.find((r) => r.id === comment.recipeId);
        if (comment !== null && recipe) {
          recipe.comments.push(comment.com);
        }
      },
    });

    this.commentDeleted.subscribe({
      next: (response) => {
        const recipe = this.recipes.find((r) => r.id == response.recipeId);
        if (recipe) {
          recipe.comments = recipe.comments.filter(
            (c) => c.commentId !== response.commentId
          );
        }
      },
    });
  }

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

  //View Recipe
  getRecipeById(id: number) {
    const recipe = this.recipes.find((rec) => rec.id === id);
    // console.log(recipe);
    if (recipe) return of(recipe);
    return this.http.get<Recipe>(
      this.apiUrl + 'recipes/' + id,
      this.getHttpOptions()
    );
  }
  //Edit Recipe
  getRecipeByIdToEdit(id: number) {
    const recipe = this.recipes.find((rec) => rec.id === id);
    var user = this.accountService.getCurrentUser();
    if (recipe) {
      if (user) {
        if (user.userName !== recipe.appUserName) {
          // console.log('Error unauthorized to edit ');
        } else {
          // console.log('Cached returned');
          return of(recipe);
        }
      }
    }
    return this.http.get<Recipe>(
      this.apiUrl + 'recipes/' + id + '/edit',
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
        next: (_) => {
          this.recipes = this.recipes.map((rec) => {
            if (rec.id === idx) {
              rec = { ...rec, ...recipe };
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
