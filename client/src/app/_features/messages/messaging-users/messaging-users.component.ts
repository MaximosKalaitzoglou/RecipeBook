import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { PaginationParams } from 'src/app/_models/payloads/pagination-params';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-messaging-users',
  templateUrl: './messaging-users.component.html',
  styleUrls: ['./messaging-users.component.css'],
})
export class MessagingUsersComponent implements OnInit, OnDestroy {
  messagingUsers: Member[] | undefined;

  @Output('on-no-chats-found') noChatsFound = new EventEmitter<boolean>();
  constructor(
    private messageService: MessageService,
    public presenceService: PresenceService
  ) {}

  ngOnInit(): void {
    this.loadMessagingUsers();
  }

  loadMessagingUsers() {
    this.messageService.getMessagingUsers().subscribe({
      next: (response) => {
        if (response) {
          this.messagingUsers = response;
          this.noChatsFound.next(
            !this.messagingUsers || this.messagingUsers.length < 1
          );
        }
      },
    });
  }

  ngOnDestroy(): void {}
}
