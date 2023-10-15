import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingService } from '../_services/shopping.service';
import { Subscription } from 'rxjs';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Ingredient } from '../_models/ingredient';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
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
          style({ opacity: 0, transform: 'translateX(15rem)' })
        ),
      ]),
    ]),
  ],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  Ingredients: Ingredient[] = [];

  private igChangeSub!: Subscription;

  faTrash = faTrash;
  faEdit = faEdit;
  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.Ingredients = this.shoppingService.getIngredients();

    this.igChangeSub = this.shoppingService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.Ingredients = ingredients;
      }
    );
  }

  deleteItem(idx: number) {
    this.shoppingService.deleteIngredient(idx);
  }

  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();
  }

  onEditItem(indx: number) {
    this.shoppingService.startedEditing.next(indx);
  }
}
