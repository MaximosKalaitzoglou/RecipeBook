import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { RecipeService } from '../../_services/recipe.service';
import { Recipe } from '../../_models/recipe.model';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Observable } from 'rxjs';
import { RecipeDto } from 'src/app/_models/recipe-dto.model';

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

  getImageData(event: File) {
    this.imageData = event;
  }

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

    this.recipeService.redirectEvent.subscribe({
      next: (value) => {
        if (value) {
          this.navigateAway();
        }
      },
    });
  }

  private initForm() {
    let recipe = {
      recipeName: '',
      recipeImagePath: '',
      recipeDescription: '',
      recipePreparation: '',
      recipeCategory: '',
      recipeDate: new Date(),
    };

    if (this.editMode) {
      this.recipeService.getRecipeById(this.id).subscribe({
        next: (recipe: Recipe) => {
          this.recipe = recipe;
        },
      });
      if (this.recipe === null) {
        alert('Recipe not found');
        return;
      }

      recipe.recipeName = this.recipe.name;
      recipe.recipeImagePath = this.recipe.imageUrl;
      recipe.recipeDescription = this.recipe.description;
      recipe.recipePreparation = this.recipe.preparationSteps;
      recipe.recipeCategory = this.recipe.category;
      recipe.recipeDate = this.recipe.dateAdded;

      if (this.recipe.ingredients) {
        for (let ing of this.recipe.ingredients) {
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
      preparation: new FormControl(
        recipe.recipePreparation,
        Validators.required
      ),
      ingredients: this.recipeIngredients,
      category: new FormControl(this.categories[0].value),
    });
  }

  get controls() {
    // a getter!
    return (<FormArray>this.recipeForm?.get('ingredients')).controls;
  }

  onSubmit() {
    // console.log(this.recipeForm?.value);
    var { name, category, preparation, description, imagePath, ingredients } =
      this.recipeForm?.value;
    // if (this.imageData) imagePath = URL.createObjectURL(this.imageData);
    var newRecipeDto;
    var updatedRecipe;

    if (this.editMode === false) {
      newRecipeDto = new RecipeDto(
        name,
        category,
        preparation,
        new Date(),
        description,
        imagePath,
        ingredients
      );
    } else {
      if (!this.recipe) return;
      updatedRecipe = new Recipe(
        this.recipe?.id,
        category,
        preparation,
        new Date(),
        name,
        description,
        imagePath,
        ingredients
      );
    }
    // console.log(this.editMode);
    // console.log(newRecipe);
    if (this.editMode && updatedRecipe) {
      this.recipeService.updateRecipe(this.id, updatedRecipe);
    } else {
      if (newRecipeDto) this.recipeService.addRecipe(newRecipeDto);
    }
    // this.navigateAway();
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
