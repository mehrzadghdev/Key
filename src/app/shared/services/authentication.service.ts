import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { LoginApiBody, LoginApiResult, RegisterApiBody, UpdateUser, UpdateUserBody, UserDetails } from '../types/authentication.type';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import * as moment from 'jalali-moment';
import { Router } from '@angular/router';
import { Company } from 'src/app/software/types/company.type';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _company: string | null = null;
  private _userDetails: string | null = null;
  private _accessToken: string | null = null;
  private _tokenExpireDate: string | null = null;
  
  get currentCompany(): Company | "" {
    const currentLocalCompany: string | null = localStorage.getItem('current-company');
    
    if (currentLocalCompany !== null) {
      return JSON.parse(currentLocalCompany);
    }

    return "";
  }

  set currentCompany(item: Company) {
    localStorage.setItem("current-company", JSON.stringify(item));
    this._company = JSON.stringify(item);
  }

  get userDetails(): UserDetails | "" {
    const currentLocalUserDetails: string | null = localStorage.getItem('user-details');

    if (currentLocalUserDetails !== null) {
      return JSON.parse(currentLocalUserDetails);
    }

    return "";
  }

  set userDetails(item: UserDetails) {
    localStorage.setItem("user-details", JSON.stringify(item));
  }

  public get userLoggedIn(): boolean {
    const localExpireDate = localStorage.getItem("token-expire");
    const localToken = localStorage.getItem("auth-token");

    if (localExpireDate !== null && localToken !== null && !this.isTokenExpired(localExpireDate)) {
      return true;
    }

    return false
  }

  get accessToken(): string | null {
    const localToken = localStorage.getItem("auth-token");

    if (this.userLoggedIn) {
      return localToken;
    }

    this.clearAccessToken();
    this.clearCurrentCompany();
    return null;
  }

  set accessToken(token: string) {
    localStorage.setItem('auth-token', token);
    this._accessToken = token;
  }

  set tokenExpireDate(seconds: number) {
    const now = moment()
    const expirationDate = now.add(seconds, 'seconds');

    localStorage.setItem("token-expire", expirationDate.format('YYYY-MM-DD HH:mm:ss'));
    this._tokenExpireDate = expirationDate.format('YYYY-MM-DD HH:mm:ss');
  }

  constructor(private http: HttpClient, private router: Router, private utility: UtilityService) { }

  public currentCompanySelected(): boolean {
    const currentLocalCompany: string | null = localStorage.getItem('current-company');

    if (currentLocalCompany && currentLocalCompany !== null && currentLocalCompany !== "") {
      return true
    }

    return false
  }

  public authorize(): void {
    if (!this.userLoggedIn) {
      this.clearAccessToken();
      this.clearCurrentCompany();
      this.router.navigate(['/auth/login']);
    }
  }

  private isTokenExpired(expireDate: string): boolean {
    const expirationDate = moment(expireDate, 'YYYY-MM-DD HH:mm:ss');
    const now = moment();

    return now.isAfter(expirationDate);
  }

  private clearCurrentCompany(): void {
    localStorage.removeItem("current-company");
  }

  private clearAccessToken(): void {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("token-expire");
    localStorage.removeItem("user-details");
    this._accessToken = null;
    this._tokenExpireDate = null
  }

  public register(registerDetails: RegisterApiBody) {
    this.clearCurrentCompany();
    return this.http.post(environment.apiUrl + "Users/AddUser", registerDetails)
  }

  public login(loginDetails: LoginApiBody): Observable<LoginApiResult> {
    this.clearCurrentCompany();
    return this.http.post<LoginApiResult>(environment.apiUrl + "login", loginDetails).pipe(
      catchError((err) => {
        if ([500, 501].includes(err.status)) {
          this.utility.message("خطای داخلی، لطفا با پشتیبانی تماس بگیرید", 'بستن')
        }
        else if ([401, 403].includes(err.status)) {
          this.utility.message("آدرس ایمیل یا رمز عبور اشتباه است.", 'بستن');
        }
        else if(!navigator.onLine) { 
          this.utility.message("ارتباط با سرور برقرار نیست! لطفا اتصال اینترنت را بررسی کنید.", 'بستن')
        }
        else {
          this.utility.message("خطای سمت سرور، لطفا بعدا سعی کنید یا با پشتیبانی ارتباط بگیرید.", 'بستن')
        }

        const error = err.error?.message || err.statusText;
        return throwError(() => error);
      })
    );
  }

  public userInfo(): Observable<UserDetails> {
    const headers: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+this.accessToken);
    
    return this.http.get<UserDetails>(environment.apiUrl + 'userInfo', { headers: headers })
  }
  
  public updateUser(userId: string ,body: UpdateUserBody): Observable<UpdateUser> {
    const headers: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+this.accessToken);
    let params = new HttpParams().set('id', userId);

    return this.http.post<UpdateUser>(environment.apiUrl + 'Users/UpdateUser', body, { headers: headers, params: params });
  }

  public logout(): void {
    this.clearAccessToken();
    this.clearCurrentCompany();
    this.router.navigate(["/auth/login"])
  }
}
