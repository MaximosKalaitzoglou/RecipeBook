import { Ingredient } from './ingredient.model';

export class Recipe {
  public id: number;
  public name: string;
  public description: string;
  public imageUrl: string;
  public ingredients: Ingredient[] = [];

  constructor(
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    ingredients: Ingredient[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.ingredients = ingredients;
  }
}
