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
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Pagination } from 'src/app/_models/pagination';
import { PaginationParams } from 'src/app/_models/payloads/pagination-params';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

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
  faTrash = faTrash;

  messagingToMember: Member | undefined;

  constructor(
    private accountService: AccountService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private memberService: MemberService
  ) {}

  private initializeChatRoom(username: string) {
    this.messageService.resetParams();
    this.messages = [];
    this.messageChatParams = this.messageService.getMessageParams();
    this.memberService.getMemberUsername(username).subscribe({
      next: (response) => {
        this.messagingToMember = response;
      },
    });
  }

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe({
      next: (params) => {
        this.username = params['username'];
        this.initializeChatRoom(this.username);
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

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: (_) => {
        this.messages?.splice(
          this.messages.findIndex((m) => m.messageId == id),
          1
        );
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
    if (this.messages && this.messagingToMember) {
      return {
        username: this.messagingToMember.userName,
        url: this.messagingToMember.photo.url,
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
