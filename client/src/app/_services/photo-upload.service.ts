import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Photo } from '../_models/photo';
import { Subject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoUploadService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  showProgress = new Subject<number>();

  uploadMemberPhoto(photo: File) {
    const formData = new FormData();
    formData.append('file', photo);
    const req = new HttpRequest(
      'POST',
      this.apiUrl + 'members/add-photo',
      formData,
      this.getHttpOptions()
    );

    return this.http.request(req).pipe(
      map((event) => this.getEventMessage(event, photo)),
      tap((message) => this.showProgress.next(message))
    );
  }

  uploadRecipePhoto(photo: File) {}

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return 0;
      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;
        return percentDone;

      case HttpEventType.Response:
        return 100;

      default:
        return 0;
    }
  }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token,
      }),
      reportProgress: true,
    };
  }
}
