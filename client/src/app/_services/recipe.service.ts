import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Recipe } from '../_models/recipe';
import { Like } from '../_models/like';
import { AccountService } from './account.service';
import { Comment } from '../_models/comment';
import { RecipePayload } from '../_models/payloads/recipe-payload';
import { PaginationResults } from '../_models/pagination';
import { PaginationParams } from '../_models/payloads/pagination-params';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  recipesCache = new Map();

  recipeParams: PaginationParams = new PaginationParams();

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

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.likeAdded.subscribe({
      next: (like) => {
        const recipe = this.findRecipe(like.recipeId);
        if (like !== null && recipe) {
          var user = this.accountService.getCurrentUser();
          if (user) {
            recipe.likes.push({ ...like.likeObj, userName: user.userName });
            recipe.likeCount++;
            recipe.hasLiked = true;
          }
        }
      },
    });

    this.likeRemoved.subscribe({
      next: (response) => {
        const recipe = this.findRecipe(response.recipeId);

        if (recipe?.likes && recipe.likeCount) {
          recipe.likes = recipe.likes.filter(
            (l: Like) => l.userName !== response.userName
          );
          recipe.likeCount--;
          recipe.hasLiked = false;
        }
      },
    });

    this.commentAdded.subscribe({
      next: (comment) => {
        const recipe = this.findRecipe(comment.recipeId);

        if (comment !== null && recipe) {
          recipe.comments.push(comment.com);
        }
      },
    });

    this.commentDeleted.subscribe({
      next: (response) => {
        const recipe = this.findRecipe(response.recipeId);
        if (recipe) {
          recipe.comments = recipe.comments.filter(
            (c: Comment) => c.commentId !== response.commentId
          );
        }
      },
    });
  }

  private findRecipe(recipeId: number) {
    const recipes = [...this.recipesCache.values()].reduce(
      (arr, elem) => arr.concat(elem.result),
      []
    );
    const recipe = recipes.find((rec: Recipe) => rec.id === recipeId);
    return recipe;
  }

  getRecipeParams() {
    return this.recipeParams;
  }

  setRecipeParams(recipeParams: PaginationParams) {
    this.recipeParams = recipeParams;
  }

  getRecipes(recipeParams: PaginationParams) {
    const response = this.recipesCache.get(
      Object.values(recipeParams).join('-')
    );

    if (response) return of(response);
    let params = this.getPaginationHeaders(recipeParams);

    return this.getPaginatedRecipes<Recipe[]>(
      this.apiUrl + 'recipes/list/',
      params
    ).pipe(
      map((response) => {
        this.recipesCache.set(Object.values(recipeParams).join('-'), response);
        return response;
      })
    );
  }

  //View Recipe
  getRecipeById(id: number) {
    const recipe = this.findRecipe(id);
    if (recipe) return of(recipe);
    return this.http.get<Recipe>(
      this.apiUrl + 'recipes/' + id,
      this.getHttpOptions()
    );
  }
  //Edit Recipe
  getRecipeByIdToEdit(id: number) {
    const recipe = this.findRecipe(id);
    if (recipe) {
      return of(recipe);
    }
    return this.http.get<Recipe>(
      this.apiUrl + 'recipes/' + id + '/edit',
      this.getHttpOptions()
    );
  }

  addRecipe(recipe: RecipePayload) {
    return this.http
      .post<Recipe>(
        this.apiUrl + 'recipes/save-recipe',
        recipe,
        this.getHttpOptions()
      )
      .pipe(
        tap((response) => {
          this.recipes.push(response);
        })
      );
  }

  updateRecipe(idx: number, recipe: RecipePayload) {
    return this.http
      .put(this.apiUrl + 'recipes/' + idx, recipe, this.getHttpOptions())
      .pipe(
        tap((res) => {
          this.recipes = this.recipes.map((rec) => {
            if (rec.id === idx) {
              rec = { ...rec, ...recipe };
            }
            return rec;
          });
        })
      );
  }

  deleteRecipe(id: number) {
    return this.http
      .delete(this.apiUrl + 'recipes/' + id, this.getHttpOptions())
      .pipe(
        tap((res) => {
          // console.log(response);
          this.recipes = this.recipes.filter((rec, i) => rec.id !== id);
          this.recipesChanged.next(this.recipes.slice());
        })
      );
  }

  clearCachedRecipes() {
    this.recipes = [];
    this.recipesCache = new Map();
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

  private getPaginatedRecipes<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginationResults<T> = new PaginationResults<T>();

    return this.http
      .get<T>(url, {
        ...this.getHttpOptions(),
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          if (response.body) {
            paginatedResult.result = response.body;
          }
          const pagination = response.headers.get('Pagination');
          if (pagination) {
            paginatedResult.pagination = JSON.parse(pagination);
          }
          return paginatedResult;
        })
      );
  }

  private getPaginationHeaders(recipeParams: PaginationParams) {
    let params = new HttpParams();

    params = params.append('offset', recipeParams.offset);
    params = params.append('pageSize', recipeParams.itemsPerPage);
    params = params.append('mostRecent', recipeParams.mostRecent);
    params = params.append('category', recipeParams.category);
    return params;
  }
}
