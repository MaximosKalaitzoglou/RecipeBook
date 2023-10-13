import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../_models/recipe.model';
import { RecipeService } from '../../_services/recipe.service';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { RecipeDto } from 'src/app/_models/recipe-dto.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: RecipeDto = new RecipeDto('', '', '', new Date(), '', '', []);
  id: number = 0;
  faDots = faBars;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });
    this.recipeService.getRecipeById(this.id).subscribe({
      next: (recipe: Recipe) => {
        // console.log(recipe);
        this.recipe = recipe;
      },
    });

    this.recipeService.redirectEvent.subscribe({
      next: (value) => {
        if (value) {
          this.router.navigate(['/recipes']);
        }
      },
    });
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
  }
}
