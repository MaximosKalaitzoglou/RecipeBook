import { Component, Input } from '@angular/core';
import { Recipe } from 'src/app/_models/recipe';
import { RecipeService } from 'src/app/_services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css'],
})
export class RecipeCardComponent {
  @Input() recipe: Recipe | null = null;
  @Input() customCardStyle: string = 'width: 80%; margin: auto';

  constructor(private recipeService: RecipeService) {}

  onLikeRecipe() {
    if (this.recipe && this.recipe.id) {
      var userString = localStorage.getItem('user');
      if (userString) {
        var user = JSON.parse(userString);
        this.recipeService
          .likeRecipe({
            userName: user.userName,
            recipeId: this.recipe.id,
          })
          .subscribe({
            next: (_) => {},
          });
      }
    }
  }
}
