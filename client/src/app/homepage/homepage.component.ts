import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  exampleCards = [
    {
      username: "George",
      title: "Best recipe app out there!",
      body: "I love sharing recipes with friends and having contests"
    },
    {
      username: "Makhs",
      title: "Facebook meets recipe app",
      body: "I love the fact you can message other people"
    },
    
    {
      username: "John Doe",
      title: "How should i say this? ...",
      body: "10/10 I met my wife here Jane!, she got alot of stars"
    }
  ]

  constructor(private router: Router) {}

  navigateToRegister() {
    this.router.navigate(['register']);
  }
}
