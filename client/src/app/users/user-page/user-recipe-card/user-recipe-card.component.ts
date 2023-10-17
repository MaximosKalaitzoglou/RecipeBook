import { Component, Input } from '@angular/core';
import { Recipe } from 'src/app/_models/recipe';

@Component({
  selector: 'app-user-recipe-card',
  templateUrl: './user-recipe-card.component.html',
  styleUrls: ['./user-recipe-card.component.css'],
})
export class UserRecipeCardComponent {
  @Input() recipes!: Recipe[];
}
