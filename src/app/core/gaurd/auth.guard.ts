import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt/jwt.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtService = inject(JwtService);
  if(jwtService.isAuthenticated()){
    return true
  }
  router.navigateByUrl("auth/signin")
  return false;
};
