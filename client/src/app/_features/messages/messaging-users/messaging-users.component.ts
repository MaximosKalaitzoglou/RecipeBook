import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { PaginationParams } from 'src/app/_models/payloads/pagination-params';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-messaging-users',
  templateUrl: './messaging-users.component.html',
  styleUrls: ['./messaging-users.component.css'],
})
export class MessagingUsersComponent implements OnInit, OnDestroy {
  messagingUsers: Member[] | undefined;
  messagingUserParams: PaginationParams | undefined;
  pagination: Pagination | undefined;

  @Output('on-no-chats-found') noChatsFound = new EventEmitter<boolean>();
  constructor(private messageService: MessageService) {
    this.messagingUserParams = this.messageService.getMessageParams();
  }

  ngOnInit(): void {
    this.loadMessagingUsers();
  }
  //TODO: Add paginationFilter on messaging Users

  loadMessagingUsers() {
    if (!this.messagingUserParams) return;

    this.messageService.getMessagingUsers(this.messagingUserParams).subscribe({
      next: (response) => {
        if (response.result && response.pagination) {
          this.messagingUsers = [
            ...(this.messagingUsers || []),
            ...response.result,
          ];
          this.pagination = response.pagination;
          this.noChatsFound.next(
            !this.messagingUsers || this.messagingUsers.length < 1
          );
        }
      },
    });
  }

  onScroll() {
    if (this.pagination && this.messagingUserParams) {
      if (
        this.messagingUserParams?.allItemsLoaded(this.pagination.totalItems)
      ) {
        return;
      }
      this.messagingUserParams?.incrementOffset();

      this.loadMessagingUsers();
    }
  }

  ngOnDestroy(): void {
    this.messagingUserParams?.setOffset(0);
  }
}
