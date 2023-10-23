import { Component, OnInit } from '@angular/core';
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
  pagination?: Pagination;
  container = 'Outbox';
  offset = 0;
  pageSize = 5;

  constructor(
    private messageService: MessageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
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

  get IsReceiver() {
    var user = this.accountService.getCurrentUser();
    if (user) return user.userName;
    else return '';
  }
}
