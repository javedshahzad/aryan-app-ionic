import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Injectable()
export class httpClientInterceptor implements HttpInterceptor {
  constructor(
    private _dataService: DataService,) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this._dataService.getUserToken();
    var headers;
      const authHeader = `Bearer ${authToken}`;
      if (authToken) {
        headers = new HttpHeaders({
          Bearer: this._dataService.getUserToken(),
          Appkey: 'test_key'
        });
      }else{
        headers = new HttpHeaders({
          Appkey: 'test_key'
        });
      }

   
    const authReq = req.clone({ headers });
    return next.handle(authReq);
  }
}
