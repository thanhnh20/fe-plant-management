import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Constants } from '../../constants/Constants';
import { BehaviorSubject, empty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  tokenName: string = Constants.TOKEN_NAME

  constructor(
    private cookieService: CookieService
  ) {
  }

  addToken(token: string) {
    const tokenExisted = this.cookieService.get(this.tokenName)
    if (tokenExisted) {
      this.cookieService.delete(this.tokenName)
    }
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000);
    this.cookieService.set(this.tokenName, token, { expires: expirationDate });
  }

  logout() {
    this.cookieService.delete(this.tokenName)
  }

  isAuthenticated(): boolean {
    return this.getToken() !== "";
  }

  getToken(): string {
    return this.cookieService.get(this.tokenName)
  }
}
