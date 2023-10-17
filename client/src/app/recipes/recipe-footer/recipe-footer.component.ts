import { Component } from '@angular/core';
import { faHeart, faComment, faStar } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-recipe-footer',
  templateUrl: './recipe-footer.component.html',
  styleUrls: ['./recipe-footer.component.css'],
})
export class RecipeFooterComponent {
  faHeart = faHeart;
  faComment = faComment;
  faStar = faStar;
}
