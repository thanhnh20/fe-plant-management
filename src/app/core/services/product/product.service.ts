import { Injectable } from '@angular/core';
import { Constants } from '../../constants/Constants';
import { RequestParams } from '../../models/generic/Request';
import { ApiService } from '../generic/api.service';
import { Observable } from 'rxjs';
import { Response } from '../../models/generic/Response';
import { Product } from '../../models/interface/Product';
import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string = Constants.URL.concat("/products")
  private tokenName = Constants.TOKEN_NAME
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
  ) { }

  getFilterProduct(params?: RequestParams): Observable<Response<Product>>{
    return this.apiService.get(this.url.concat("/filter"), {
      params: params,
      responseType: 'json'
    })
  }

  createProduct(requestBody: Product): Observable<Response<Product>> {
    const token = this.cookieService.get(this.tokenName)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.post(this.url, requestBody, {
      headers: headers,
      responseType: 'json'
    })
  }

  updateProduct(requestBody: Product): Observable<Response<Product>> {
    const token = this.cookieService.get(this.tokenName)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.put(this.url.concat("/update"), requestBody, {
      headers: headers,
      responseType: 'json'
    })
  }
}
