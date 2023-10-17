import { Photo } from './photo';

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
}
