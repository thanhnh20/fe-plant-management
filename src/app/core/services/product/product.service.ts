import { Injectable } from '@angular/core';
import { Constants } from '../../constants/Constants';
import { RequestParams } from '../../models/generic/Request';
import { ApiService } from '../generic/api.service';
import { Observable } from 'rxjs';
import { Response } from '../../models/generic/Response';
import { Product } from '../../models/interface/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string = Constants.URL.concat("/products")
  constructor(
    private apiService: ApiService
  ) { }

  getFilterProduct(params?: RequestParams): Observable<Response<Product>>{
    return this.apiService.get(this.url.concat("/filter"), {
      params: params,
      responseType: 'json'
    })
  }
}
