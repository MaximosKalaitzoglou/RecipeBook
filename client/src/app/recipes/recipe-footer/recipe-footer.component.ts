import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { faHeart, faComment, faStar } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Like } from 'src/app/_models/like';
@Component({
  selector: 'app-recipe-footer',
  templateUrl: './recipe-footer.component.html',
  styleUrls: ['./recipe-footer.component.css'],
})
export class RecipeFooterComponent implements OnInit {
  @Input() likes: Like[] = [];
  @Input() likeCount: number = 0;
  @Input() hasLiked = false;
  @Input() commentCount: number = 0;
  faHeart = faHeart;
  faComment = faComment;
  faStar = faStar;

  @Output('on-like') onLike = new EventEmitter();
  @Output('on-unlike') onUnlike = new EventEmitter();
  @Output('on-show-comments') showComments = new EventEmitter();
  @Output('on-new-comment') postComment = new EventEmitter<string>();
  modalRef?: BsModalRef;

  ngOnInit(): void {}
  constructor(private modalService: BsModalService) {}

  onLikeRecipe() {
    this.hasLiked = !this.hasLiked;
    if (this.hasLiked) {
      this.onLike.emit();
    } else {
      this.onUnlike.emit();
    }
  }

  showUsers(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onShowComments() {
    this.showComments.emit();
  }

  onPostComment(commentForm: NgForm) {
    console.log('Commented posted');
    this.postComment.emit(commentForm.controls['comment'].value);
  }
}
