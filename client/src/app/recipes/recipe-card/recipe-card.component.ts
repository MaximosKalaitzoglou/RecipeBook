import { Component, Input } from '@angular/core';
import { Recipe } from 'src/app/_models/recipe';
import { AccountService } from 'src/app/_services/account.service';
import { RecipeService } from 'src/app/_services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css'],
})
export class RecipeCardComponent {
  @Input() recipe: Recipe | null = null;
  @Input() customCardStyle: string = 'width: 80%; margin: auto';

  constructor(
    private recipeService: RecipeService,
    private accountService: AccountService
  ) {}

  onLikeRecipe() {
    if (this.recipe && this.recipe.id) {
      var user = this.accountService.getCurrentUser();
      if (user === null) throw Error('Unknown user detected!');
      this.recipeService.likeRecipe({
        userName: user.userName,
        recipeId: this.recipe.id,
      });
    }
  }

  onUnlikeRecipe() {
    if (this.recipe && this.recipe.id) {
      var user = this.accountService.getCurrentUser();
      if (user === null) throw Error('Unknown user detected!');
      this.recipeService.unlikeRecipe({
        userName: user.userName,
        recipeId: this.recipe.id,
      });
    }
  }
}
