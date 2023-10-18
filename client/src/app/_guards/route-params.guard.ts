import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class routeParamsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const id = route.params['id'];

    // Check if the id is not a valid integer
    if (isNaN(id)) {
      // Redirect to the "Not Found" page for non-integer IDs
      this.router.navigateByUrl('/not-found');
      return false;
    }

    // Continue with your authorization logic to check if the user can access the recipe
    // ...

    return true; // Return true if the user is authorized to access the recipe
  }
}
