import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { map, of, take, tap } from 'rxjs';
import {
  getPaginatedResults,
  getPaginationMessagesHeaders,
} from './pagination-helper';
import { Message } from '../_models/message';
import { environment } from 'src/environments/environment';
import { getHttpOptions } from './http-headers-helper';
import { Member } from '../_models/member';
import { PaginationParams } from '../_models/payloads/pagination-params';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  apiUrl = environment.apiUrl;
  user: User | null = null;
  messageParams: PaginationParams = new PaginationParams();
  messagesCache = new Map();

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

  getMessageParams() {
    this.messageParams.setItemsPerPage(5);
    return this.messageParams;
  }

  setMessageParams(messageParams: PaginationParams) {
    this.messageParams = messageParams;
  }

  getUserMessages(messageParams: { offSet: number; pageSize: number }) {
    let params = getPaginationMessagesHeaders({
      offset: messageParams.offSet,
      itemsPerPage: messageParams.pageSize,
    });
    return getPaginatedResults<Message[]>(
      this.apiUrl + 'messages',
      params,
      this.http
    ).pipe(
      map((response) => {
        this.messagesCache.set(
          Object.values(messageParams).join('-'),
          response
        );
        return response;
      })
    );
  }

  getMessagingUsers(messagingUserParams: PaginationParams) {
    const response = this.messagesCache.get(
      Object.values(messagingUserParams).join('-')
    );

    if (response) return of(response);

    let params = getPaginationMessagesHeaders({
      offset: messagingUserParams.offset,
      itemsPerPage: messagingUserParams.itemsPerPage,
    });
    return getPaginatedResults<Member[]>(
      this.apiUrl + 'messages/get-users',
      params,
      this.http
    ).pipe(
      map((response) => {
        this.messagesCache.set(
          Object.values(messagingUserParams).join('-'),
          response
        );
        return response;
      })
    );
  }

  getMessageSocket(username: string) {
    return this.http.get<Message[]>(
      this.apiUrl + 'messages/socket/' + username,
      getHttpOptions()
    );
  }

  createMessage(messageDto: { receiverUsername: string; content: string }) {
    return this.http
      .post<Message>(this.apiUrl + 'messages', messageDto, getHttpOptions())
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }
}
