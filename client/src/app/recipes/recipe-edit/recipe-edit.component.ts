import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { RecipeService } from '../../_services/recipe.service';
import { Recipe } from 'src/app/_models/recipe';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: number = 0;
  editMode: boolean = false;
  faTrash = faTrash;
  recipeForm: FormGroup | undefined;
  recipeIngredients = new FormArray<any>([]);
  recipe: Recipe | null = null;
  imageData: File | null = null;

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
      this.editMode = params['id'] != null;
      // console.log(this.editMode);
      this.recipeService.getRecipeById(this.id).subscribe({
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
}
