import { Ingredient } from './ingredient';
import { Like } from './like';

export interface Recipe {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  preparationSteps: string;
  category: string;
  dateAdded: string;
  ingredients: Ingredient[];
  likeCount: number;
  hasLiked: boolean;
  likes: Like[];
  appUserPhotoUrl?: string;
  appUserName?: string;
}
