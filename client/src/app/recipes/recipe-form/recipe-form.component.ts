import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/_guards/leave-page.guard';
import { Recipe } from 'src/app/_models/recipe';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
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
export class RecipeFormComponent implements OnInit {
  faTrash = faTrash;
  recipeForm: FormGroup | undefined;
  recipeIngredients = new FormArray<any>([]);

  @Input() recipe: Recipe | null = null;
  @Output('on-submit-new') onSubmitNew = new EventEmitter<Recipe>();
  @Output('on-submit-update') onSubmitUpdate = new EventEmitter<Recipe>();
  @Output('on-cancel-form') onCancel = new EventEmitter<boolean>();

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

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    if (this.recipe) {
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
      this.createForm(
        this.recipe.name,
        this.recipe.imageUrl,
        this.recipe.description,
        this.recipe.preparationSteps,
        this.recipe.category.replace(
          this.recipe.category[0],
          this.recipe.category[0].toUpperCase()
        )
      );
    } else {
      this.createForm();
    }
  }

  private createForm(
    name: string = '',
    imageUrl: string = '',
    description: string = '',
    preparationSteps: string = '',
    category: string = this.categories[0].value
  ) {
    this.recipeForm = new FormGroup({
      name: new FormControl(name, [Validators.required]),
      imagePath: new FormControl(imageUrl, [Validators.required]),
      description: new FormControl(description, [Validators.required]),
      preparation: new FormControl(preparationSteps, Validators.required),
      ingredients: this.recipeIngredients,

      category: new FormControl(category),
    });
  }

  get controls() {
    // a getter!
    return (<FormArray>this.recipeForm?.get('ingredients')).controls;
  }

  onSubmit() {
    if (this.recipe) {
      const payload = this.createPayLoad('update');
      this.onSubmitUpdate.emit(payload);
    } else {
      const payload = this.createPayLoad('new');

      this.onSubmitNew.emit(payload);
    }
  }

  createPayLoad(type: string) {
    var { name, category, preparation, description, imagePath, ingredients } =
      this.recipeForm?.value;
    var payload: Recipe = {
      name: name,
      category: category,
      preparationSteps: preparation,
      description: description,
      imageUrl: imagePath,
      ingredients: ingredients,
      dateAdded: new Date().toISOString(),
      likeCount: 0,
      likes: [],
      comments: [],
      hasLiked: false,
    };
    if (type === 'update' && this.recipe) {
      payload.hasLiked = this.recipe.hasLiked;
      payload.likes = this.recipe.likes;
      payload.likeCount = this.recipe.likeCount;
      payload.comments = this.recipe.comments;
      return payload;
    } else {
      var user = this.accountService.getCurrentUser();
      if (user == null) throw Error('Unauthorized');
      payload.appUserName = user.userName;
      payload.appUserPhotoUrl = user.photoUrl;
      return payload;
    }
  }

  onCancelForm() {
    this.onCancel.emit(this.recipeForm?.dirty);
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

  onRemoveAllIngredients() {
    (<FormArray>this.recipeForm?.get('ingredients')).clear();
  }

  onDeleteIngredient(idx: number) {
    (<FormArray>this.recipeForm?.get('ingredients')).removeAt(idx);
  }
}
