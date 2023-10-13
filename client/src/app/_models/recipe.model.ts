import { Ingredient } from './ingredient.model';

export class Recipe {
  public id: number;
  public name: string;
  public description: string;
  public category: string;
  public preparationSteps: string;
  public dateAdded: Date;
  public imageUrl: string;
  public ingredients: Ingredient[] = [];

  constructor(
    id: number,
    category: string,
    preparationSteps: string,
    dateAdded: Date,
    name: string,
    description: string,
    imageUrl: string,
    ingredients: Ingredient[]
  ) {
    this.id = id;
    this.category = category;
    this.preparationSteps = preparationSteps;
    this.dateAdded = dateAdded;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.ingredients = ingredients;
  }
}
