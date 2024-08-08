import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Crypto } from '../../helpers/crypto.helper';

@Injectable({
  providedIn: 'root'
})
export class VersioningService {
  public get version(): number {
    return Number(Crypto.decrypt(localStorage.getItem(Crypto.encrypt('version')) ?? '1.0')) as number;
  }

  constructor(private http: HttpClient) { }

  public initVersioning(): void {
    const localVersion: number = Number(localStorage.getItem('version')) as number;

    this.getCurrentVersion().subscribe(version => {
      if (!localVersion) {
        this.setVersion(version);
      }
      else if (localVersion && localVersion !== version) {
        caches.keys().then(function (names) {
          for (let name of names) caches.delete(name);
        });

        this.setVersion(version);
        location.reload();
      }
    })
  }

  private setVersion(version: number): void {
    localStorage.setItem(Crypto.encrypt("version"), Crypto.encrypt(version.toString()));
  }

  private getCurrentVersion(): Observable<number> {
    return this.http.post<number>(environment.apiUrl + 'Values/AppVersion', null);
  }
}
