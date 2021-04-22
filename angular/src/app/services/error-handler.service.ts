import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements HttpInterceptor {

  constructor(public toaster: ToasterService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if(req.url != '/api/account/me') {
          if(err.error) {
            if(Array.isArray(err.error)) {
              this.toaster.error(`${err.status} - ${err.statusText}`, err.error[0]);
            } else if(typeof err.error == "string") {
              this.toaster.error(`${err.status} - ${err.statusText}`, err.error);
            } else if("detail" in err.error) {
              this.toaster.error(`${err.status} - ${err.statusText}`, err.error.detail);
            }
          } else {
            this.toaster.error(`${err.status} - ${err.statusText}`, err.message);
          }
        }
        return throwError(err);
      })
    );
  }
}
