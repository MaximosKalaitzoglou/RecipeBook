import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { take } from 'rxjs';
import {
  getPaginatedResults,
  getPaginationMessagesHeaders,
} from './pagination-helper';
import { Message } from '../_models/message';
import { environment } from 'src/environments/environment';
import { getHttpOptions } from './http-headers-helper';
import { Member } from '../_models/member';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  apiUrl = environment.apiUrl;
  user: User | null = null;
  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  getUserMessages(offSet: number, pageSize: number, container: string) {
    let params = getPaginationMessagesHeaders({
      offset: offSet,
      itemsPerPage: pageSize,
      container: container,
    });
    return getPaginatedResults<Message[]>(
      this.apiUrl + 'messages',
      params,
      this.http
    );
  }

  getMessagingUsers() {
    return this.http.get<Member[]>(
      this.apiUrl + 'messages/get-users',
      getHttpOptions()
    );
  }

  getMessageSocket(username: string) {
    return this.http.get<Message[]>(
      this.apiUrl + 'messages/socket/' + username,
      getHttpOptions()
    );
  }
}
