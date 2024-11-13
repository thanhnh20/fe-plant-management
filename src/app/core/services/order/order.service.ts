import { Injectable } from '@angular/core';
import { Constants } from '../../constants/Constants';
import { ApiService } from '../generic/api.service';
import { CookieService } from 'ngx-cookie-service';
import { RequestParams } from '../../models/generic/Request';
import { Order } from '../../models/interface/Order';
import { Response } from '../../models/generic/Response';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url: string = Constants.URL.concat("/orders")
  private tokenName = Constants.TOKEN_NAME
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
  ) { }

  getFilterOrders(params?: RequestParams): Observable<Response<Order>>{
    const token = this.cookieService.get(this.tokenName)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.get(this.url, {
      params: params,
      headers: headers,
      responseType: 'json'
    })
  }

  updateStatusOrder(status: string, orderId: number): Observable<Order>{
    const token = this.cookieService.get(this.tokenName)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.put(this.url.concat(`/${orderId}`), {status: status},{
      headers: headers,
      responseType: 'json'
    })
  }
}
