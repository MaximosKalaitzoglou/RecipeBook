import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { Subject, map, of, switchMap, take, tap } from 'rxjs';
import {
  getPaginatedResults,
  getPaginationMessagesHeaders,
} from './pagination-helper';
import { Message } from '../_models/message';
import { environment } from 'src/environments/environment';
import { getHttpOptions } from './http-headers-helper';
import { Member } from '../_models/member';
import { PaginationParams } from '../_models/payloads/pagination-params';
import { MemberService } from './member.service';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  apiUrl = environment.apiUrl;
  user: User | null = null;
  messageParams: PaginationParams = new PaginationParams();
  messagingUsersCache = new Map();
  messageChatCache = new Map();

  updatedMessagingUser = new Subject<Member>();

  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private memberService: MemberService
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

  getMessagingUsers(messagingUserParams: PaginationParams) {
    const response = this.messagingUsersCache.get(
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
        this.messagingUsersCache.set(
          Object.values(messagingUserParams).join('-'),
          response
        );
        return response;
      })
    );
  }

  getMessageSocket(username: string, messageParams: PaginationParams) {
    const response = this.messageChatCache.get(
      Object.values(messageParams).join('-') + username
    );

    if (response) return of(response);

    let params = getPaginationMessagesHeaders(messageParams);

    return getPaginatedResults<Message[]>(
      this.apiUrl + 'messages/socket/' + username,
      params,
      this.http
    ).pipe(
      map((response) => {
        this.messageChatCache.set(
          Object.values(messageParams).join('-') + username,
          response
        );
        return response;
      })
    );
  }

  resetParams() {
    this.messageParams = new PaginationParams();
  }

  createMessage(messageDto: { receiverUsername: string; content: string }) {
    return this.http
      .post<Message>(this.apiUrl + 'messages', messageDto, getHttpOptions())
      .pipe(
        switchMap((response) => {
          // Update the chat cache
          const username = messageDto.receiverUsername;
          var chatRoom = this.messageChatCache.get(
            Object.values(this.messageParams).join('-') + username
          );

          if (chatRoom) {
            chatRoom.result = [response, ...chatRoom.result];
            console.log(chatRoom);
          }

          const userCache = this.messagingUsersCache.get(
            Object.values(this.messageParams).join('-')
          );
          if (userCache) {
            if (
              !userCache.result.find((m: Member) => m.userName === username)
            ) {
              this.memberService.getMemberUsername(username).subscribe({
                next: (response) => {
                  userCache.result.push(response);
                  this.updatedMessagingUser.next(response);
                },
              });
            }
          }
          return of(response);
        })
      );
  }

  deleteMessage(id: number) {
    return this.http.delete(this.apiUrl + 'messages/' + id, getHttpOptions());
  }
}
