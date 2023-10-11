import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../../_models/recipe.model';
import { RecipeService } from '../../_services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  // recipes: Recipe[] | null = null;
  recipes$: Observable<Recipe[]> | null = null;
  subscription!: Subscription;
  isFetching = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.subscription = this.recipeService.recipesChanged.subscribe({
      next: (recipes: Recipe[]) => {
        this.recipes$ = of(recipes);
        this.isFetching = false;
      },
    });

    this.recipes$ = this.recipeService.getRecipes();

    // this.recipeService.getRecipes().subscribe({
    //   next: (response) => {
    //     this.recipes = response;
    //     // console.log(response);
    //     this.isFetching = false;
    //   },
    //   error: (error) => {
    //     this.isFetching = false;
    //   },
    // });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigateToNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
