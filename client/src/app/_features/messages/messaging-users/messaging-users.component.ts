import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-messaging-users',
  templateUrl: './messaging-users.component.html',
  styleUrls: ['./messaging-users.component.css'],
})
export class MessagingUsersComponent implements OnInit {
  messagingUsers: Member[] = [];
  @Output('on-no-chats-found') noChatsFound = new EventEmitter<boolean>();
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessagingUsers();
  }
  //TODO: Add paginationFilter on messaging Users

  loadMessagingUsers() {
    this.messageService.getMessagingUsers().subscribe({
      next: (response) => {
        this.messagingUsers = response;
        this.noChatsFound.next(this.messagingUsers.length < 1);
      },
    });
  }
}
