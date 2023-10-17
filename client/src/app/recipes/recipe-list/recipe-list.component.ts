import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from '../../_services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map, of } from 'rxjs';
import { Recipe } from 'src/app/_models/recipe';
import { MemberService } from 'src/app/_services/member.service';

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
  filterCategory: string = 'all';

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.subscription = this.recipeService.recipesChanged.subscribe({
      next: (recipes: Recipe[]) => {
        this.recipes$ = of(recipes);
        this.isFetching = false;
      },
    });
    this.memberService.getMembers().subscribe({
      next: (members) => {},
    });

    this.recipes$ = this.recipeService.getRecipes();
  }

  onCategoryChange(event: any) {
    this.filterCategory = event?.target.value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigateToNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
