import { Ingredient } from '../_models/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  deletedIngredient = new Subject<number>();

  private ingredients = [
    new Ingredient('Steak', 1),
    new Ingredient('Tomatoes', 5),
    new Ingredient('Bread', 5),
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients = this.ingredients.filter((val, idx) => idx != index);
    this.ingredientsChanged.next(this.ingredients.slice());
    this.deletedIngredient.next(index);
  }

  deleteIngredients() {
    this.ingredients = [];
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredient(ingredient: Ingredient): void;

  addIngredient(ingredient: Ingredient[]): void;

  addIngredient(ingredient: any): void {
    if (Array.isArray(ingredient)) {
      this.ingredients.push(...ingredient);
    } else {
      this.ingredients.push(ingredient);
    }
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
