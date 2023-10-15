import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { MemberService } from './_services/member.service';
import { Observable } from 'rxjs';
import { Member } from './_models/member';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'shopping-app';

  constructor(
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  getMembers() {}

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
