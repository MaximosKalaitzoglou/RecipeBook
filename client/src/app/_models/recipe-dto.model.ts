import { Ingredient } from './ingredient.model';

export class RecipeDto {
  public name: string;
  public description: string;
  public category: string;
  public preparationSteps: string;
  public dateAdded: Date;
  public imageUrl: string;
  public ingredients: Ingredient[] = [];

  constructor(
    name: string,
    category: string,
    preparationSteps: string,
    dateAdded: Date,
    description: string,
    imageUrl: string,
    ingredients: Ingredient[]
  ) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.preparationSteps = preparationSteps;
    this.dateAdded = dateAdded;
    this.imageUrl = imageUrl;
    this.ingredients = ingredients;
  }
}
