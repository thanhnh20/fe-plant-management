import { Injectable } from '@angular/core';
import { Constants } from '../../constants/Constants';
import { ApiService } from '../generic/api.service';
import { AuthResponse, LoginRequest } from '../../models/interface/Auth';
import { Response } from '../../models/generic/Response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = Constants.URL.concat("/admins");

  constructor(
    private apiService: ApiService
  ) { }

  login(requestBody: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post(this.url.concat("/login"), requestBody, {
      responseType: 'json'
    })
  }
}
