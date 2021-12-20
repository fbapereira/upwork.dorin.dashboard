import { Observable, shareReplay, switchMap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { config } from '../../configs/app.config';
import { County, Locality, Street } from '../models/geolocation.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  private subscriptionKey = config.cargus.subscriptionKey;
  private defaultCountryId = config.cargus.defaultCountryId;
  private countiesURL = config.cargus.countiesURL;
  private localitiesURL = config.cargus.localitiesURL;
  private streetsURL = config.cargus.streetsURL;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  public getCounties(): Observable<County[]>{
    return this.authService.getToken().pipe(
      switchMap((token) => {
        let _countiesURL = this.countiesURL.replace("_countryId_", this.defaultCountryId);
        return this.http.get<County[]>(_countiesURL,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ token }`,
            "Ocp-Apim-Subscription-Key": this.subscriptionKey,
          }
        });
      }),
      shareReplay(),
    );
  }

  public getLocalities(county: County): Observable<Locality[]> {
    return this.authService.getToken().pipe(
      switchMap((token) => {
        let _localitiesURL = this.localitiesURL.replace("_countryId_", this.defaultCountryId);
        _localitiesURL = _localitiesURL.replace("_countyId_", county.CountyId.toString());
        return this.http.get<Locality[]>(_localitiesURL,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ token }`,
            "Ocp-Apim-Subscription-Key": this.subscriptionKey,
          }
        });
      })
    );
  }

  public getStreet(locality: Locality): Observable<Street[]> {
    return this.authService.getToken().pipe(
      switchMap((token) => {
        let _streetURL = this.streetsURL.replace("_localityId_", locality.LocalityId.toString());
        return this.http.get<Street[]>(_streetURL,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ token }`,
            "Ocp-Apim-Subscription-Key": this.subscriptionKey,
          }
        });
      }),
    );
  }
}
