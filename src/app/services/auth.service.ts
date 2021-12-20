import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { config } from '../../configs/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL = config.cargus.authURL;
  private password = config.cargus.password;
  private userName = config.cargus.userName;
  private devMode = config.devMode;

  private subscriptionKey = config.cargus.subscriptionKey;

  constructor(private http: HttpClient) { }

  public getToken(): Observable<string> {
    if (!this.devMode) {
      return this.http.post<string>(this.authURL, {
        "UserName": this.userName,
        "Password": this.password
      }, {
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": this.subscriptionKey,
        }
      });
    }
    return of('test');
  }
}
