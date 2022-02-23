import { Inject, Injectable } from '@angular/core';
import {OKTA_AUTH} from "@okta/okta-angular";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {from, lastValueFrom, Observable} from "rxjs";
import {OktaAuth} from "@okta/okta-auth-js";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    return from(this.handleAccess(request,next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>>{

    const theEndPoint = environment.shopApiUrl + '/orders';

    //Only add an access token for secured endpoints
    const secureEndpoints = [theEndPoint];

    if(secureEndpoints.some(url => request.urlWithParams.includes(url))){

      //get access token
      const accessToken = this.oktaAuth.getAccessToken();

      //clone the request and add a new header with access token
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    // return await lastValueFrom(next.handle(request));
    return next.handle(request).toPromise();
  }
}
