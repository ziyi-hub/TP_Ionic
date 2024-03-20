import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { map } from "rxjs";


export const AuthGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated().pipe(
    map((value)=>{
      if (!value) {
        router.navigateByUrl('/login');
        return false
      }
      return true;
    })
  );
}