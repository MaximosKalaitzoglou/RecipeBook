import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faHeart, faComment, faStar } from '@fortawesome/free-solid-svg-icons';
import { Like } from 'src/app/_models/like';
@Component({
  selector: 'app-recipe-footer',
  templateUrl: './recipe-footer.component.html',
  styleUrls: ['./recipe-footer.component.css'],
})
export class RecipeFooterComponent implements OnInit{
  @Input() likes: Like[] = [];
  faHeart = faHeart;
  faComment = faComment;
  faStar = faStar;
  @Output('on-like') onLike = new EventEmitter();


  ngOnInit(): void {

  }
  constructor() {}

  onLikeRecipe() {
    this.onLike.emit();
  }
}
