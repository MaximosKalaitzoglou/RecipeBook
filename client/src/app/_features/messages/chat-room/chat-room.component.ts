import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { MessageService } from '../../../_services/message.service';
import { Message } from '../../../_models/message';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
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
        this.username = params['username'];
        this.loadMessageSocket(this.username);
      },
    });
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
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
        this.messages.push(response);
        messageForm.reset();
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
