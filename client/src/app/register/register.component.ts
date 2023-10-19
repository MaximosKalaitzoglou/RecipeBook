import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgForm,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(
    private accService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [
        Validators.minLength(3),
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.matchValues('password'),
      ]),
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      },
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }

  register() {
    console.log(this.registerForm?.value);
    // this.accService.register(this.model).subscribe({
    //   next: (response) => {
    //     this.cancel();
    //   },
    // });
    // registerForm.resetForm();
  }

  cancel() {
    console.log(this.registerForm.get('username')?.errors);
    this.router.navigateByUrl('/');
  }
}
