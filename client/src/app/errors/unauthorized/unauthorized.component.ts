import { Component } from '@angular/core';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
})
export class UnauthorizedComponent {
  faD = faUserSecret;
}
