import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] | undefined;
  subscription!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.recipeService.recipesChanged.subscribe({
      next: (recipes: Recipe[]) => {
        this.recipes = recipes;
      },
    });

    this.recipeService.getRecipes().subscribe({
      next: (response) => {
        this.recipes = response;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigateToNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
