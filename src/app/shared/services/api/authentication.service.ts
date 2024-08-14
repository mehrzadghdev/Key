import { Injectable } from '@angular/core';
import { Observable, catchError, first, of, throwError } from 'rxjs';
import { AddUser, AddUserBody, ForgetPassword, ForgetPasswordBody, Login, LoginBody, ResetPassword, ResetPasswordBody, UpdateUser, UpdateUserBody, UserDetails, UserInfo } from '../../types/authentication.type';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import * as moment from 'jalali-moment';
import { Router } from '@angular/router';
import { Company } from 'src/app/software/types/definitions/company.type';
import { UtilityService } from '../utilities/utility.service';
import { Crypto } from '../../helpers/crypto.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _company: string | null = null;
  private _userDetails: string | null = null;
  private _accessToken: string | null = null;
  private _tokenExpireDate: string | null = null;
  
  get currentCompany(): Company | "" {
    const currentLocalCompany: string | null = Crypto.decrypt(localStorage.getItem(Crypto.encrypt('current-company')) ?? '');
    
    if (currentLocalCompany !== null && currentLocalCompany !== '') {
      return JSON.parse(currentLocalCompany);
    }

    return "";
  }

  set currentCompany(item: Company) {
    localStorage.setItem(Crypto.encrypt("current-company"), Crypto.encrypt(JSON.stringify(item)));
    this._company = JSON.stringify(item);
  }

  get userDetails(): UserDetails | "" {
    const currentLocalUserDetails: string | null = Crypto.decrypt(localStorage.getItem(Crypto.encrypt('user-details')) ?? '');

    if (currentLocalUserDetails !== null && currentLocalUserDetails !== '') {
      return JSON.parse(currentLocalUserDetails);
    }

    return "";
  }

  set userDetails(item: UserDetails) {
    localStorage.setItem(Crypto.encrypt("user-details"), Crypto.encrypt(JSON.stringify(item)));
  }

  public get userLoggedIn(): boolean {
    const localExpireDate = Crypto.decrypt(localStorage.getItem(Crypto.encrypt("token-expire")) ?? '');
    const localToken = Crypto.decrypt(localStorage.getItem(Crypto.encrypt("auth-token")) ?? '');

    if (localExpireDate !== null && localExpireDate !== '' && localToken !== null && localToken !== '' && !this.isTokenExpired(localExpireDate)) {
      return true;
    }

    return false
  }

  get accessToken(): string | null {
    const localToken = Crypto.decrypt(localStorage.getItem(Crypto.encrypt("auth-token")) ?? '');

    if (this.userLoggedIn) {
      return localToken;
    }

    this.clearAccessToken();
    this.clearCurrentCompany();
    return null;
  }

  set accessToken(token: string) {
    localStorage.setItem(Crypto.encrypt("auth-token"), Crypto.encrypt(token));
    this._accessToken = token;
  }

  set tokenExpireDate(seconds: number) {
    const now = moment()
    const expirationDate = now.add(seconds, 'seconds');

    localStorage.setItem(Crypto.encrypt("token-expire"), Crypto.encrypt(expirationDate.format('YYYY-MM-DD HH:mm:ss')));
    this._tokenExpireDate = expirationDate.format('YYYY-MM-DD HH:mm:ss');
  }

  constructor(private http: HttpClient, private router: Router, private utility: UtilityService) { }

  public currentCompanySelected(): boolean {
    const currentLocalCompany: string | null = Crypto.decrypt(localStorage.getItem(Crypto.encrypt('current-company')) ?? '');

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
    localStorage.removeItem(Crypto.encrypt("current-company"));
  }

  private clearAccessToken(): void {
    localStorage.removeItem(Crypto.encrypt("auth-token"));
    localStorage.removeItem(Crypto.encrypt("token-expire"));
    localStorage.removeItem(Crypto.encrypt("user-details"));
    this._accessToken = null;
    this._tokenExpireDate = null
  }

  public register(registerDetails: AddUserBody): Observable<AddUser> {
    this.clearCurrentCompany();
    return this.http.post<AddUser>(environment.apiUrl + "Users/AddUser", registerDetails);
  }

  public login(loginDetails: LoginBody): Observable<Login> {
    this.clearCurrentCompany();
    return this.http.post<Login>(environment.apiUrl + "Users/Login", loginDetails).pipe(
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

  public userInfo(): Observable<UserInfo> {
    const headers: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+this.accessToken);
    
    return this.http.post<UserInfo>(environment.apiUrl + 'Users/UserInfo', null, { headers: headers }).pipe(
      first()
    )
  }
  
  public updateUser(userId: string ,body: UpdateUserBody): Observable<UpdateUser> {
    const headers: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+this.accessToken);
    let params = new HttpParams().set('id', userId);

    return this.http.post<UpdateUser>(environment.apiUrl + 'Users/UpdateUser', body, { headers: headers, params: params });
  }

  public forgetPassword(body: ForgetPasswordBody): Observable<ForgetPassword> {
    return this.http.post<ForgetPassword>(environment.apiUrl + 'Users/ForgotPassword', body);
  }

  public resetPassword(body: ResetPasswordBody): Observable<ResetPassword> {
    return this.http.post<ResetPassword>(environment.apiUrl + 'Users/ResetPassword', body);
  }

  public logout(): void {
    this.clearAccessToken();
    this.clearCurrentCompany();
    this.router.navigate(["/auth/login"])
  }
}
