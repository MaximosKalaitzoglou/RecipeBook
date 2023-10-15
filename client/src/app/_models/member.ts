import { Photo } from './photo';

export interface Member {
  id: number;
  userName: string;
  interests: string;
  introduction: string;
  gender: string;
  country: string;
  memberSince: string;
  dateOfBirth: string;
  photos: Photo[];
  recipeIds: number[];
}
