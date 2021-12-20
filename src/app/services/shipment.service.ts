import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { map, of, switchMap, tap } from 'rxjs';

import { Injectable } from '@angular/core';

import { config } from '../../configs/app.config';
import { Order } from '../models/order.model';
import { Recipient, Shipment } from '../models/shipment.model';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private Sender = config.cargus.sender;

  constructor(
    private geolocationService: GeolocationService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService
  ) { }

  public Send(order: Order) {
    this.spinner.show();
    const shipment: Shipment = {
      Parcels: 1,
      Envelopes: 1,
      TotalWeight: 1,
      ShipmentPayer: 1, // 2 for the client
      Sender: this.Sender
    };

    const recipient: Recipient = {};

    recipient.Name = order.name;
    recipient.PhoneNumber = order.mobile;
    recipient.Email = order.email;
    recipient.BuildingNumber = order.shippingNumber;
    recipient.AddressText = "";
    recipient.ContactPerson = order.name;
    recipient.CountryId = 1;

    // county id
    const solveCounty$ = this.geolocationService.getCounties().pipe(
      map((values) => values.filter((value) => value.Name === order.shippingCounty)),
      tap((values) => {
        if (values.length > 0){
          recipient.CountyId = values[0].CountyId;
          recipient.CountyName = values[0].Name;
        } else {
          recipient.CountyId = undefined;
          recipient.CountyName = order.shippingCounty;
        }
      }),
    );

    // localities / city
    const solveLocality$ = solveCounty$.pipe(
      switchMap((counties) => {
        if (counties.length > 0) {
          return this.geolocationService.getLocalities(counties[0]);
        } else {
          return of([]);
        }
      }),
      map((values) => values.filter((value) => value.Name === order.shippingCity)),
      tap((values) => {
        if (values.length > 0){
          recipient.LocalityId = values[0].LocalityId;
          recipient.LocalityName = values[0].Name;
        } else {
          recipient.LocalityId = undefined;
          recipient.LocalityName = order.shippingCity;
        }
      }),
    );

    // street
    const solveStreet$ = solveLocality$.pipe(
      switchMap((cities) => {
        if (cities.length > 0) {
          return this.geolocationService.getStreet(cities[0]);
        } else {
          return of([]);
        }
      }),
      map((values) => values.filter((value) => value.Name === order.shippingStreet)),
      tap((values) => {
        if (values.length > 0){
          recipient.StreetId = values[0].StreetId;
          recipient.StreetName = values[0].Name;
          recipient.PostalCode = values[0].PostalNumbers[0].PostalCode;
        } else {
          recipient.StreetId = undefined;
          recipient.StreetName = order.shippingStreet;
        }
      }),
    )

    solveStreet$.subscribe(() => {
      shipment.Recipient = recipient;

      this.toastrService.info("Shipment request has been sent to Cargus", "Shipment Successful");
      console.log(shipment);
    })
  }
}
