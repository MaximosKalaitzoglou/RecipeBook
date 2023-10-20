import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root',
})
export class PhotoUploadService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  uploadMemberPhoto(photo: File) {
    const formData = new FormData();
    formData.append('file', photo);

    return this.http.post<Photo>(
      this.apiUrl + 'members/add-photo',
      formData,
      this.getHttpOptions()
    );
  }

  uploadRecipePhoto(photo: File) {}

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
