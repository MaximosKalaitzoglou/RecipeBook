import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { environment } from 'src/environments/environment.development';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'shopping-app';
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // this.getUsers();
    this.setCurrentUser();
  }

  getUsers() {
    // this.http.get(this.apiUrl + 'users').subscribe({
    //   next: (response) => (this.users = response),
    //   error: (error) => console.log(error),
    //   complete: () => console.log('Request complete'),
    // });
  }

  setCurrentUser() {
    const userJwt = localStorage.getItem('user');
    if (!userJwt) return;
    const user: User = JSON.parse(userJwt);
    this.accountService.setCurrentUser(user);
  }
}
