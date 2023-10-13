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
      body: "I love sharing recipes with friends and having contests",
      rating: 4,
    },
    {
      username: "Makhs",
      title: "Facebook meets recipe app",
      body: "I love the fact you can message other people",
      rating: 4.5,

    },
    
    {
      username: "John Doe",
      title: "How should i say this? ...",
      body: "5/5 I met my wife here Jane!, she got alot of stars",
      rating: 5,

    }
  ]

  max = 5;
  rate = 4;
  isReadonly = true;

  constructor(private router: Router) {}

  navigateToRegister() {
    this.router.navigate(['register']);
  }
}
