import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from '../../_services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Recipe } from 'src/app/_models/recipe';
import { Pagination } from 'src/app/_models/pagination';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] | undefined;
  pagination: Pagination | undefined;
  offset = 0;
  pageSize = 5;
  subscription!: Subscription;
  isFetching = false;
  filterCategory: string = 'all';
  mostRecent: boolean = true;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.recipes$ = this.recipeService.getRecipes();
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService
      .getRecipes(
        this.offset,
        this.pageSize,
        this.mostRecent,
        this.filterCategory
      )
      .subscribe({
        next: (response) => {
          if (response.result && response.pagination) {
            this.recipes = [...(this.recipes || []), ...response.result];
            // this.recipes = response.result;
            this.pagination = response.pagination;
          }
        },
      });
  }

  onScroll() {
    if (this.pagination) {
      if (this.offset + this.pageSize >= this.pagination.totalItems) {
        return;
      }
      this.offset += this.pageSize;
      this.loadRecipes();
    }
  }

  onCategoryChange(event: any) {
    this.filterCategory = event?.target.value;
    if (this.filterCategory.toLowerCase().trim() != 'new') {
      this.filterCategory = this.filterCategory.toLowerCase().trim();
      this.offset = 0;
      this.recipes = [];
      this.loadRecipes();
    }
  }

  ngOnDestroy(): void {}

  navigateToNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
