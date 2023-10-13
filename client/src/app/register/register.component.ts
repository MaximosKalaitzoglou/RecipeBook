import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor() {}
  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  register() {
    console.log(this.model);
  }

  cancel() {}
}
