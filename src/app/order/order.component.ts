import { combineLatest, filter, first, map, startWith, Subject, switchMap, tap } from 'rxjs';

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { statusENUM } from '../enums/status.enum';
import { County, Locality, Street } from '../models/geolocation.model';
import { Order } from '../models/order.model';
import { GeolocationService } from '../services/geolocation.service';
import { OrderService } from '../services/order.service';
import { ShipmentService } from '../services/shipment.service';
import { SmartbillService } from '../services/smartbill.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnChanges {

  @Input()
  public order?: Order;

  public form: FormGroup;
  public statuses = statusENUM;

  public counties$ = new Subject<County[]>();
  public localities$ = new Subject<Locality[]>();
  public streets$ = new Subject<Street[]>();

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private geolocationService: GeolocationService,
    private shipmentService: ShipmentService,
    private smartbillService: SmartbillService,
  ) {
    this.form = this.fb.group({
      name: [''],
      street: [''],
      county: [''],
      city: [''],
      mobile: [''],
      email: [''],
      status: [''],
      shippingPrice: [''],
      shippingCounty: [''],
      shippingCity: [''],
      shippingStreet: [''],
      shippingNumber: [''],
      comment: [''],
      isShipped:  [false],
      isInvoiceMade: [false],
    });

    // Autocomplete of County
    combineLatest([
      this.form.controls["shippingCounty"].valueChanges.pipe(startWith('')),
      this.geolocationService.getCounties()
    ]).pipe(
      map(([value, counties]) => !value ? counties : counties.filter((county) => county.Name.toLowerCase().includes(value.toLowerCase()))),
    ).subscribe((counties) => this.counties$.next(counties));


    // Autocomplete Locality
    combineLatest([
      this.form.controls["shippingCounty"].valueChanges,
      this.counties$
    ]).pipe(
      filter(() => !!this.form.controls["shippingCounty"].value),
      map(([, counties]) => counties.filter((county) => county.Name === this.form.controls["shippingCounty"].value)[0]),
      filter((county) => !!county),
      switchMap((county) => combineLatest([
          this.form.controls["shippingCity"].valueChanges.pipe(startWith('')),
          this.geolocationService.getLocalities(county)
      ])),
      map(([value, localities]) => !value ? localities : localities.filter((locality) => locality.Name.toLowerCase().includes(value.toLowerCase()))),
    ).subscribe((localities) => {
      this.localities$.next(localities);
    });

    // Autocomplete street
    combineLatest([
      this.form.controls["shippingCity"].valueChanges,
      this.localities$
    ]).pipe(
      filter(() => !!this.form.controls["shippingCity"].value),
      map(([, localities]) => localities.filter((locality) => locality.Name === this.form.controls["shippingCity"].value)[0]),
      filter((locality) => !!locality),
      switchMap((locality) => combineLatest([
        this.form.controls["shippingStreet"].valueChanges.pipe(startWith('')),
        this.geolocationService.getStreet(locality),
      ])),
      map(([value, streets]) => !value ? streets : streets.filter((street) => street.Name.toLowerCase().includes(value.toLowerCase()))),
    ).subscribe((streets) => {
      this.streets$.next(streets);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.form.patchValue(changes['order'].currentValue);
  }

  public compare(a: any, b: any): boolean {
    return a.id === b.id;
  }

  public save() {
    let newOrder = this.form.getRawValue() as Order;
    if (this.order) {
      this.orderService.save({
        ...newOrder,
        orderId: this.order.orderId,
        orderDate: this.order.orderDate,
        productName: this.order.productName,
        shippingDate: this.order.shippingDate
      }).pipe(first()).subscribe();
    }
  }

  public ship() {
    let newOrder = this.form.getRawValue() as Order;
    if (this.order) {
      newOrder = {
        ...newOrder,
        orderId: this.order.orderId,
        orderDate: this.order.orderDate,
        productName: this.order.productName,
        shippingDate: this.order.shippingDate
      };

      this.orderService.save(newOrder).pipe(
        first(),
        tap(() => {
          if(this.order){
            this.shipmentService.Send(newOrder);
          }
        })
      ).subscribe();
    }
  }

  public invoice() {
    let newOrder = this.form.getRawValue() as Order;
    if (this.order) {
      newOrder = {
        ...newOrder,
        orderId: this.order.orderId,
        orderDate: this.order.orderDate,
        productName: this.order.productName,
        shippingDate: this.order.shippingDate
      };

      this.orderService.save(newOrder).pipe(
        first(),
        tap(() => {
          if(this.order){
            this.smartbillService.send(newOrder);
          }
        })
      ).subscribe();
    }
  }

}
