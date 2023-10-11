import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { Ingredient } from '../../_models/ingredient.model';
import { ShoppingService } from '../../_services/shopping.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  editMode = false;
  editedItem!: Ingredient;
  editedItemIndex!: number;

  @ViewChild('shoppingList') shoppingForm!: NgForm;

  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingService.startedEditing.subscribe({
      next: (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingService.getIngredient(index);
        this.shoppingForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      },
    });

    this.shoppingService.deletedIngredient.subscribe({
      next: (idx: number) => {
        if (idx === this.editedItemIndex) this.resetForm();
      },
    });
  }

  ngOnDestroy(): void {}

  resetForm() {
    this.shoppingForm.reset();
    this.editMode = false;
  }

  onRemoveAll() {
    this.shoppingService.deleteIngredients();
    this.resetForm();
  }

  // onDelete() {
  //   this.resetForm();
  //   this.shoppingService.deleteIngredient(this.editedItemIndex);
  // }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.shoppingService.updateIngredient(
        this.editedItemIndex,
        newIngredient
      );
    } else {
      this.shoppingService.addIngredient(newIngredient);
    }
    this.resetForm();
  }

  onClear() {
    this.resetForm();
  }
}
