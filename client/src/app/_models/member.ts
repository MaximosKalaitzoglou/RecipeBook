import { Photo } from './photo';
import { Recipe } from './recipe';

export interface Member {
  id: number;
  userName: string;
  alias: string;
  description: string;
  gender: string;
  country: string;
  memberSince: string;
  dateOfBirth: string;
  photo: Photo;
  recipes: Recipe[];
}
