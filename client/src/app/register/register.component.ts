import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private accService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  register(registerForm: NgForm) {
    this.accService.register(this.model).subscribe({
      next: (response) => {
        this.cancel();
      },
      error: (err) => {
        this.toastr.error(err.error);
      },
    });
    registerForm.resetForm();
  }

  cancel() {
    this.router.navigate(['/recipes']);
  }
}
