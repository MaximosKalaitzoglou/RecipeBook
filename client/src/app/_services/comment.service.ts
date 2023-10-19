import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { RecipeService } from './recipe.service';
import { Comment } from '../_models/comment';
@Injectable({
  providedIn: 'root',
})
export class CommentService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  postComment(commentRequest: {
    userName: string;
    recipeId: number;
    comment: string;
    dateCommented: string;
  }) {
    this.http
      .post<Comment>(
        this.apiUrl + 'comment',
        commentRequest,
        this.getHttpOptions()
      )
      .subscribe({
        next: (comment) => {
          this.recipeService.commentAdded.next({
            com: comment,
            recipeId: commentRequest.recipeId,
          });
        },
      });
  }

  deleteComment(commentRequest: {
    userName: string;
    recipeId: number;
    commentId: number;
  }) {
    const url =
      this.apiUrl +
      `comment?username=${commentRequest.userName}&recipeId=${commentRequest.recipeId}&commentId=${commentRequest.commentId}`;

    this.http.delete(url, this.getHttpOptions()).subscribe({
      next: (_) => {
        this.recipeService.commentDeleted.next(commentRequest);
      },
    });
  }

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
}
