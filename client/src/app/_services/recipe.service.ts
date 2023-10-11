import { Injectable } from '@angular/core';
import { Recipe } from '../_models/recipe.model';
import { Ingredient } from '../_models/ingredient.model';
import { ShoppingService } from './shopping.service';
import { Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Greek Souvlaki',
      'For the best Greek Souvlaki ever, follow this recipe!',
      'https://www.seriouseats.com/thmb/qAysZs1vJYvMCSSpsHRqRlsvExQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__20090319-pork-souvlaki-9a80ec7534d3427c888d2d0f939540a6.jpg',
      [
        new Ingredient('chicken meat', 5),
        new Ingredient('pita', 1),
        new Ingredient('fries', 10),
        new Ingredient('tomato', 1),
        new Ingredient('tzatziki', 1),
      ]
    ),
    new Recipe(
      'A classic Burger',
      'What else is needed?',
      'https://www.allrecipes.com/thmb/5JVfA7MxfTUPfRerQMdF-nGKsLY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/25473-the-perfect-basic-burger-DDMFS-4x3-56eaba3833fd4a26a82755bcd0be0c54.jpg',
      [
        new Ingredient('bread', 2),
        new Ingredient('beef', 1),
        new Ingredient('tomato', 1),
        new Ingredient('lettuce', 2),
        new Ingredient('chicken souce', 1),
        new Ingredient('cheese', 2),
      ]
    ),
  ];

  // private apiRecipes: Recipe[] = [];
  // private recipes: Recipe[] = [];
  recipesChanged = new Subject<Recipe[]>();

  constructor(
    private shoppingService: ShoppingService,
    private http: HttpClient
  ) {}

  getRecipes() {
    // return this.recipes.slice();
    return this.http.get<Recipe[]>('https://localhost:5001/api/recipes', {});
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingService.addIngredient(ingredients);
  }

  getRecipeById(id: number) {
    return this.recipes[id];
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
