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

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  paginatedResults: PaginationResults<Recipe[]> = new PaginationResults<
    Recipe[]
  >();

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
        var recipe = this.recipes.find((r) => r.id === like.recipeId);
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

  getRecipes(
    offset?: number,
    itemsPerPage?: number,
    mostRecent?: boolean,
    category?: string
  ) {
    let params = new HttpParams();

    if (offset && itemsPerPage) {
      params = params.append('offset', offset);
      params = params.append('pageSize', itemsPerPage);
    }

    if (mostRecent) params = params.append('mostRecent', mostRecent);

    if (category) params = params.append('category', category);
    // if (this.recipes.length > 0) return of(this.recipes);
    return this.http
      .get<Recipe[]>(this.apiUrl + 'recipes/list/', {
        ...this.getHttpOptions(),
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          if (response.body) {
            this.paginatedResults.result = response.body;
          }
          const pagination = response.headers.get('Pagination');
          if (pagination) {
            this.paginatedResults.pagination = JSON.parse(pagination);
          }
          return this.paginatedResults;
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
