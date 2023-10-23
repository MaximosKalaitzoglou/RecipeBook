import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { Pagination } from 'src/app/_models/pagination';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[] | undefined;
  messagingUsers: Member[] = [];
  pagination?: Pagination;
  container = 'Outbox';
  offset = 0;
  pageSize = 5;

  constructor(
    private messageService: MessageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // this.loadMessages();
    this.loadMessagingUsers();
  }

  loadMessages() {
    this.messageService
      .getUserMessages(this.offset, this.pageSize, this.container)
      .subscribe({
        next: (response) => {
          this.messages = response.result;
          this.pagination = response.pagination;
          console.log(this.messages);
        },
      });
  }

  loadMessagingUsers() {
    this.messageService.getMessagingUsers().subscribe({
      next: (response) => {

        this.messagingUsers = response;
      },
    });
  }

  loadMessageSocket(username: string) {
    this.messageService.getMessageSocket(username).subscribe({
      next: (response) => {
        this.messages = response;
      },
    });
  }

  onScroll() {
    if (this.pagination && this.offset) {
      if (this.offset + this.pageSize >= this.pagination.totalItems) {
        return;
      }
      this.offset += this.pageSize;
      this.loadMessages();
    }
  }

  logSmth() {
    // console.log('Clicked');
  }

  get currentUser() {
    var user = this.accountService.getCurrentUser();
    if (user) return user.userName;
    else return '';
  }
}
