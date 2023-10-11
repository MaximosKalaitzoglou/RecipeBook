import { Injectable } from '@angular/core';
import { Recipe } from '../_models/recipe.model';
import { Ingredient } from '../_models/ingredient.model';
import { ShoppingService } from './shopping.service';
import { Subject, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];

  recipesChanged = new Subject<Recipe[]>();

  constructor(
    private shoppingService: ShoppingService,
    private http: HttpClient
  ) {}

  getRecipes() {
    if (this.recipes.length > 0) return of(this.recipes);
    return this.http
      .get<Recipe[]>('https://localhost:5001/api/recipes', {})
      .pipe(
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
    const recipe = this.recipes[id];
    if (recipe) return of(recipe);
    return this.http.get<Recipe>('https://localhost:5001/api/recipes/' + id);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(idx: number, recipe: Recipe) {
    this.recipes[idx] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(idx: number) {
    this.recipes = this.recipes.filter((rec, i) => i !== idx);
    this.recipesChanged.next(this.recipes.slice());
  }
}
