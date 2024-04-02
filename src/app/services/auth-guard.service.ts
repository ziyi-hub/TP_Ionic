import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "./auth.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const isAuthenticated = await this.authService.isAuthenticated();
      if (!isAuthenticated) {
        this.router.navigateByUrl('/login');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in canActivate', error);
      return false;
    }
  }
}
