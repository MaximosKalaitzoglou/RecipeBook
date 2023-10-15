import { Photo } from './photo';
import { Recipe } from './recipe.model';

export interface Member {
  id: number;
  userName: string;
  interests: string;
  introduction: string;
  gender: string;
  country: string;
  memberSince: Date;
  dateOfBirth: Date;
  photos: Photo[];
  recipes: Recipe[];
}
