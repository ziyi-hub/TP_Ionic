import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { map } from "rxjs";


export const AuthGuard = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return (await auth.isAuthenticated()).pipe(
    map((value)=>{
      if (!value) {
        router.navigateByUrl('/login');
        return false
      }
      return true;
    })
  );
}