import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../models/generic/Response';
import { Dashboard } from '../../models/interface/Dashboard';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../generic/api.service';
import { Constants } from '../../constants/Constants';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private url: string = Constants.URL.concat("/dashboard")
  private tokenName = Constants.TOKEN_NAME

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
  ) { }

  getDashboard(): Observable<Response<Dashboard>>{
    const token = this.cookieService.get(this.tokenName)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.get(this.url,{
      headers: headers,
      responseType: 'json'
    })
  }
}
