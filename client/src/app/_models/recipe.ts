import { Ingredient } from './ingredient';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  preparationSteps: string;
  category: string;
  dateAdded: string;
  ingredients: Ingredient[];
  appUserId: number;
}
