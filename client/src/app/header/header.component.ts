import { Component, EventEmitter, Output } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from '../_services/account.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  faBars = faBars;
  constructor(public accountService: AccountService, private router: Router) {}
  model: any = {};
  login(loginForm: NgForm) {
    // console.log(this.model);
    this.accountService.login(this.model).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/recipes');
      },
    });
  }

  logout() {
    this.accountService.logout();
  }
}
