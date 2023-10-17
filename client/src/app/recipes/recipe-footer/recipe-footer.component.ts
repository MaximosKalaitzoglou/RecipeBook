import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
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
  faHeart = faHeart;
  faComment = faComment;
  faStar = faStar;
  @Output('on-like') onLike = new EventEmitter();
  modalRef?: BsModalRef;

  ngOnInit(): void {}
  constructor(private modalService: BsModalService) {}

  onLikeRecipe() {
    this.hasLiked = !this.hasLiked;
    this.onLike.emit();
  }

  showUsers(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
