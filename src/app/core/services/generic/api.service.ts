import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Options } from '../../models/generic/Request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  get<T>(url: string, options: Options): Observable<T> {
    return this.httpClient.get(url, options) as Observable<T>
  }

  post<T>(url: string, body: any, options: Options) {
    return this.httpClient.post(url, body, options) as Observable<T>
  }

  put<T>(url: string, body: any, options: Options) {
    return this.httpClient.put(url, body, options) as Observable<T>
  }

  delete<T>(url: string, options: Options): Observable<T> {
    return this.httpClient.delete(url, options) as Observable<T>
  }
}
