import { Injectable } from '@angular/core';
import { Recipe } from '../_models/recipe.model';
import { Ingredient } from '../_models/ingredient.model';
import { ShoppingService } from './shopping.service';
import { Subject, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RecipeDto } from '../_models/recipe-dto.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  apiUrl = environment.apiUrl;

  recipesChanged = new Subject<Recipe[]>();

  redirectEvent = new Subject<Boolean>();

  constructor(
    private shoppingService: ShoppingService,
    private http: HttpClient
  ) {}

  getRecipes() {
    if (this.recipes.length > 0) return of(this.recipes);
    return this.http.get<Recipe[]>(this.apiUrl + 'recipes/list/', {}).pipe(
      map((recipes) => {
        this.recipes = recipes;
        return recipes;
      })
    );
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingService.addIngredient(ingredients);
  }

  getRecipeById(id: number) {
    const recipe = this.recipes.find((rec) => rec.id === id);
    // console.log(recipe);
    if (recipe) return of(recipe);
    return this.http.get<Recipe>(this.apiUrl + 'recipes/' + id);
  }

  addRecipe(recipe: RecipeDto) {
    this.http
      .post<Recipe>(this.apiUrl + 'recipes/save-recipe', recipe)
      .subscribe({
        next: (response: Recipe) => {
          console.log(response);
          this.recipes.push(response);
          this.redirectEvent.next(true);
        },
      });
  }

  updateRecipe(idx: number, recipe: Recipe) {
    console.log(recipe);
    this.http.put(this.apiUrl + 'recipes/' + recipe.id, recipe).subscribe({
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
    this.http.delete(this.apiUrl + 'recipes/' + id).subscribe({
      next: (response) => {
        // console.log(response);
        this.recipes = this.recipes.filter((rec, i) => rec.id !== id);
        this.recipesChanged.next(this.recipes.slice());
        this.redirectEvent.next(true);
      },
    });
  }
}
