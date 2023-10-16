import { Component, Input } from '@angular/core';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipe-header',
  templateUrl: './recipe-header.component.html',
  styleUrls: ['./recipe-header.component.css']
})
export class RecipeHeaderComponent {
  @Input() memberPhoto = '';
  @Input() username = '';
  @Input() timeStamp = '';
  faDot = faDotCircle;

}
