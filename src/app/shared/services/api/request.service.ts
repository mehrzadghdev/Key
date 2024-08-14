import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environment/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilityService } from '../utilities/utility.service';
import { Router } from '@angular/router';
import { Company } from 'src/app/software/types/definitions/company.type';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private authentication: AuthenticationService, private utilityService: UtilityService, private router: Router) { }

  public post<Result, Body = any>(controlAndMethodName: string, body: Body, hasDatabase: boolean = true): Observable<Result> {
    const databaseId = (this.authentication.currentCompany as Company).databaseId;

    const request = this.http.post<Result>(
      environment.apiUrl + controlAndMethodName,
      hasDatabase ? { databaseId: databaseId, ...body } : body,
      { headers: this.headers() }
    ).pipe(
      catchError((err) => {
        if ([500, 501].includes(err.status)) {
          this.utilityService.message("خطای داخلی، لطفا با پشتیبانی تماس بگیرید", 'بستن')
        }
        else if ([401, 403].includes(err.status)) {
          this.utilityService.message("احراز هویت انجام نشد، لطفا مجدد وارد حساب کاربری شوید.", 'بستن')
          this.authentication.logout();
          this.router.navigate(['/auth/login']);
        }
        else if ([409].includes(err.status)) {
          this.utilityService.message("کد وارد شده تکراری است، لطفا از کد دیگری استفاده کنید.", 'بستن')
        }
        else if (!navigator.onLine) {
          this.utilityService.message("ارتباط با سرور برقرار نیست! لطفا اتصال اینترنت را بررسی کنید.", 'بستن')
        }
        else {
          this.utilityService.message("خطای سمت سرور، لطفا بعدا سعی کنید یا با پشتیبانی ارتباط بگیرید.", 'بستن')
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
    const headers: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer " + this.authentication.accessToken);

    return headers;
  }
}
