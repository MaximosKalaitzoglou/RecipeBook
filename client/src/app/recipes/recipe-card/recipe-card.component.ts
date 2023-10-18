import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Recipe } from 'src/app/_models/recipe';
import { AccountService } from 'src/app/_services/account.service';
import { RecipeService } from 'src/app/_services/recipe.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css'],
})
export class RecipeCardComponent implements OnInit {
  @Input() recipe: Recipe | null = null;
  @Input() customCardStyle: string = 'width: 80%; margin: auto';
  faDelete = faTrashAlt;
  modalRef?: BsModalRef;
  user: any;
  constructor(
    private recipeService: RecipeService,
    private accountService: AccountService,
    private modalService: BsModalService
  ) {}

  onLikeRecipe() {
    if (this.recipe && this.recipe.id) {
      var user = this.accountService.getCurrentUser();
      if (user === null) throw Error('Unknown user detected!');
      this.recipeService.likeRecipe({
        userName: user.userName,
        recipeId: this.recipe.id,
      });
    }
  }

  ngOnInit(): void {
    this.user = this.accountService.getCurrentUser();
  }

  onUnlikeRecipe() {
    if (this.recipe && this.recipe.id) {
      var user = this.accountService.getCurrentUser();
      if (user === null) throw Error('Unknown user detected!');
      this.recipeService.unlikeRecipe({
        userName: user.userName,
        recipeId: this.recipe.id,
      });
    }
  }

  onShowComments(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onPostComment(comment: string) {
    if (this.recipe && this.recipe.id) {
      var newComment = {
        userName: this.user.userName,
        recipeId: this.recipe.id,
        comment: comment,
        dateCommented: new Date().toISOString(),
      };
      this.recipeService.postComment(newComment);
    }
  }

  onDeleteComment(commentId: number) {
    if (this.recipe?.id)
      this.recipeService.deleteComment({
        userName: this.user.userName,
        recipeId: this.recipe?.id,
        commentId: commentId,
      });
  }
}
