import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const AuthGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return () => {
    const isAuthenticatedSubscription = auth.isAuthenticated().subscribe({
      next: (value: any) => {
        if (!value.auth.currentUser) {
          isAuthenticatedSubscription.unsubscribe(); 
          router.navigateByUrl('/login');
        }
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Observable completed');
      }
    });

    return true; 
  };
}