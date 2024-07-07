import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environment/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private authentication: AuthenticationService, private utilityService: UtilityService) { }

  public post<Result, Body = any>(controlAndMethodName: string, body: Body): Observable<Result> {
    const request = this.http.post<Result>(environment.apiUrl + controlAndMethodName, body, { headers: this.headers() }).pipe(
      catchError((err) => {
        if ([500].includes(err.status)) {
          this.utilityService.message("خطای داخلی، لطفا با پشتیبانی تماس بگیرید", 'بستن')
        }
        if ([401, 403].includes(err.status)) {
          this.authentication.logout();
          this.authentication.authorize();
        }
        if ([409].includes(err.status)) {
          this.utilityService.message("کد وارد شده تکراری است، لطفا از کد دیگری استفاده کنید.", 'بستن')
        }
        if(!navigator.onLine) { 
          this.utilityService.message("ارتباط با سرور برقرار نیست! لطفا اتصال اینترنت را بررسی کنید.", 'بستن')
        }

        const error = err.error?.message || err.statusText;
        return throwError(() => error);
      })
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
