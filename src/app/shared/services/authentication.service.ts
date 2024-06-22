import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { LoginApiBody, LoginApiResult, RegisterApiBody } from '../types/authentication.type';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import * as moment from 'jalali-moment';
import { Router } from '@angular/router';
import { Company } from '../../company/types/company.type';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _company = localStorage.getItem("current-company");
  private _accessToken: string | null = null;
  private _tokenExpireDate: string | null = null;
  
  get currentCompany(): Company | "" {
    if (this._company !== null) {
      return JSON.parse(this._company);
    }

    return '';
  }

  set currentCompany(item: Company) {
    localStorage.setItem("current-company", JSON.stringify(item));
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

  constructor(private http: HttpClient, private router: Router) { }

  public currentCompanySelected(): boolean {
    if (this._company && this._company !== null) {
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
    this._accessToken = null;
    this._tokenExpireDate = null
  }

  public register(registerDetails: RegisterApiBody) {
    return this.http.post(environment.apiUrl + "Users/AddUser", registerDetails)
  }

  public login(loginDetails: LoginApiBody): Observable<LoginApiResult> {
    return this.http.post<LoginApiResult>(environment.apiUrl + "login", loginDetails);
  }

  public logout(): void {
    this.clearAccessToken();
    this.clearCurrentCompany();
    this.router.navigate(["/auth/login"])
  }
}
