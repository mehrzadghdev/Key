import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private authentication: AuthenticationService) { }

  public post<Result, Body = any>(controlAndMethodName: string, body: Body): Observable<Result> {
    const request = this.http.post<Result>(environment.apiUrl + controlAndMethodName, body, { headers: this.headers() }).pipe(
      // catchError((err) => {
      //   if ([401, 403].includes(err.status)) {
      //     this.authentication.logout();
      //     this.authentication.authorize();
      //   }
      //   const error = err.error?.message || err.statusText;
      //   console.error(err);

      //   return throwError(() => error);
      // })
    ) as Observable<Result>;

    return request;
  }

  public get<Result>(controlAndMethodName: string): Observable<Result> {
    return this.http.get<Result>(environment.apiUrl + controlAndMethodName, { headers: this.headers() })
  }
  
  private headers(): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+this.authentication.accessToken);

    return headers;
  }
}
