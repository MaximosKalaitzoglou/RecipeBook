import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
  animations: [
    trigger('fade-out', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(
          '0.3s ease-in-out',
          style({
            opacity: 0,
            transform: 'translateX(12rem)',
          })
        ),
      ]),
    ]),
  ],
})
export class RecipeEditComponent implements OnInit {
  id: number = 0;
  editMode: boolean = false;
  faTrash = faTrash;
  recipeForm: FormGroup | undefined;
  recipeIngredients = new FormArray<any>([]);

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
      this.initForm();
    });
  }

  private initForm() {
    let recipe = {
      recipeName: '',
      recipeImagePath: '',
      recipeDescription: '',
    };

    if (this.editMode) {
      const editRecipe = this.recipeService.getRecipeById(this.id);
      recipe.recipeName = editRecipe.name;
      recipe.recipeImagePath = editRecipe.imagePath;
      recipe.recipeDescription = editRecipe.description;
      if (editRecipe.ingredients) {
        for (let ing of editRecipe.ingredients) {
          const group = new FormGroup({
            name: new FormControl(ing.name, [Validators.required]),
            amount: new FormControl(ing.amount, [
              Validators.required,
              Validators.pattern(/^[1-9]+[0-9]*$/),
            ]),
          });
          this.recipeIngredients.push(group);
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipe.recipeName, [Validators.required]),
      imagePath: new FormControl(recipe.recipeImagePath, [Validators.required]),
      description: new FormControl(recipe.recipeDescription, [
        Validators.required,
      ]),
      ingredients: this.recipeIngredients,
    });
  }

  get controls() {
    // a getter!
    return (<FormArray>this.recipeForm?.get('ingredients')).controls;
  }

  get formArray() {
    return <FormArray>this.recipeForm?.get('ingredients');
  }

  onSubmit() {
    // console.log(this.recipeForm?.value);
    var { name, description, imagePath, ingredients } = this.recipeForm?.value;
    const newRecipe = new Recipe(name, description, imagePath, ingredients);
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }
    this.navigateAway();
  }

  navigateAway() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngredient() {
    this.recipeIngredients.push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onDeleteIngredient(idx: number) {
    (<FormArray>this.recipeForm?.get('ingredients')).removeAt(idx);
  }

  onRemoveAllIngredients() {
    (<FormArray>this.recipeForm?.get('ingredients')).clear();
  }

  onCancelForm() {
    this.navigateAway();
  }
}
