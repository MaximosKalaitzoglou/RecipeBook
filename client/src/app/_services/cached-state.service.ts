import { Injectable } from '@angular/core';
import { RecipeService } from './recipe.service';
import { MemberService } from './member.service';

@Injectable({
  providedIn: 'root',
})
export class CachedStateService {
  constructor(
    private recipeService: RecipeService,
    private memberService: MemberService
  ) {}

  clearCachedDataOnLogout() {
    this.recipeService.clearCachedRecipes();
    this.memberService.clearCachedMembers();
  }
}
