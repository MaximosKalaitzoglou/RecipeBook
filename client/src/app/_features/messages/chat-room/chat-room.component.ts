import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { MessageService } from '../../../_services/message.service';
import { Message } from '../../../_models/message';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Pagination } from 'src/app/_models/pagination';
import { PaginationParams } from 'src/app/_models/payloads/pagination-params';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  messageDictionary = new Map<string, Message[]>();
  messages: Message[] | undefined;
  pagination: Pagination | undefined;
  messageChatParams: PaginationParams | undefined;
  paramsSub!: Subscription;
  username: string = '';

  constructor(
    private accountService: AccountService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe({
      next: (params) => {
        this.messageService.resetParams();
        this.messages = [];
        this.messageChatParams = this.messageService.getMessageParams();
        this.username = params['username'];
        this.loadMessageSocket(this.username);
      },
    });
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
    this.messageChatParams?.setOffset(0);
  }
  //TODO: Add paginationFilter on Chat messages

  onPostMessage(messageForm: NgForm) {
    // console.log(messageForm.value.message);
    const payload = {
      receiverUsername: this.username,
      content: messageForm.value.message,
    };
    this.messageService.createMessage(payload).subscribe({
      next: (response) => {
        if (this.messages) {
          this.messages = [response, ...this.messages];
          messageForm.reset();
        }
      },
    });
  }

  loadMessageSocket(username: string) {
    if (!this.messageChatParams) return;
    this.messageService
      .getMessageSocket(username, this.messageChatParams)
      .subscribe({
        next: (response) => {
          if (response.result) {
            if (this.messages) {
              this.messages.push(...response.result);
            } else {
              this.messages = response.result;
            }

            this.pagination = response.pagination;
          }
        },
      });
  }

  onScroll() {
    if (this.pagination && this.messageChatParams) {
      if (this.messageChatParams?.allItemsLoaded(this.pagination.totalItems)) {
        return;
      }
      this.messageChatParams?.incrementOffset();

      this.loadMessageSocket(this.username);
    }
  }

  get User(): { username: string; url: string } | null {
    if (this.messages) {
      return {
        username: this.messages[0].senderUsername,
        url: this.messages[0].senderPhotoUrl,
      };
    }
    return null;
  }

  get currentUser() {
    var user = this.accountService.getCurrentUser();
    if (user) return user.userName;
    else return '';
  }
}
