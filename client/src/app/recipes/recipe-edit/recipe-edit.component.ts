import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../../_services/recipe.service';
import { Recipe } from 'src/app/_models/recipe';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/_guards/leave-page.guard';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, CanComponentDeactivate {
  id: number = 0;
  recipe: Recipe | null = null;
  formIsDirty = false;

  categories = [
    {
      name: 'Breakfast',
      value: 'Breakfast',
    },
    {
      name: 'Lunch',
      value: 'Lunch',
    },
    {
      name: 'Desert',
      value: 'Desert',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      // console.log(this.editMode);
      this.recipeService.getRecipeByIdToEdit(this.id).subscribe({
        next: (recipe) => {
          this.recipe = recipe;
        },
      });
    });

    this.recipeService.redirectEvent.subscribe({
      next: (value) => {
        if (value) {
          this.navigateAway();
        }
      },
    });
  }

  onSubmit(payload: Recipe) {
    this.recipeService.updateRecipe(this.id, payload);
  }

  navigateAway() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancelForm() {
    this.navigateAway();
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    return confirm('Do you want to discard this changes ?');
  }
}
