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
    this.recipeService.getRecipes(this.offset, this.pageSize).subscribe({
      next: (response) => {
        if (response.result && response.pagination) {
          this.recipes = [...(this.recipes || []), ...response.result];
          this.pagination = response.pagination;
        }
      },
    });
  }

  // pageChanged(event: any) {
  //   if (this.pageNumber != event.page) {
  //     this.pageNumber = event.page;
  //     // window.scrollTo({ top: 0, behavior: 'smooth' });
  //     this.loadRecipes();
  //   }
  // }

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
  }

  ngOnDestroy(): void {}

  navigateToNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
