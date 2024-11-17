import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../models/generic/Response';
import { Dashboard } from '../../models/interface/Dashboard';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../generic/api.service';
import { Constants } from '../../constants/Constants';
import { HttpHeaders } from '@angular/common/http';
import { Order, OrderDetail } from '../../models/interface/Order';

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

  getOrderDetail(orderId: string): Observable<Response<OrderDetail>>{
    const token = this.cookieService.get(this.tokenName)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.get(this.url.concat(`/orders/${orderId}`),{
      headers: headers,
      responseType: 'json'
    })
  }
}
