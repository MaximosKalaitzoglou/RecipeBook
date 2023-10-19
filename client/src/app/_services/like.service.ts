import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Like } from '../_models/like';
import { catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token,
      }),
    };
  }

  likeRecipe(likeRequest: { userName: string; recipeId: number }) {
    this.http
      .post<Like>(this.apiUrl + 'like', likeRequest, this.getHttpOptions())
      .subscribe((like) => {
        // Emit an event to update recipes
        this.recipeService.likeAdded.next({
          likeObj: like,
          recipeId: likeRequest.recipeId,
        });
      }),
      catchError((error) => {
        console.log('Error liking recipe');
        throw error;
      });
  }

  unlikeRecipe(likeRequest: { userName: string; recipeId: number }) {
    const url =
      this.apiUrl +
      `like?username=${likeRequest.userName}&recipeId=${likeRequest.recipeId}`;

    this.http.delete(url, this.getHttpOptions()).subscribe(
      (_) => {
        // Emit an event to update recipes
        this.recipeService.likeRemoved.next(likeRequest);
      },
      catchError((error) => {
        console.log('Error unLiking recipe');
        throw error;
      })
    );
  }
}
