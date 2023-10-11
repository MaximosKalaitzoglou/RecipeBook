import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../_models/recipe.model';
import { RecipeService } from '../../_services/recipe.service';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe = new Recipe('', '', '', []);
  id: number = 0;

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
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
