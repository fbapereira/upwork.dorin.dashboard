import { Observable, of } from 'rxjs';
import { config } from 'src/configs/app.config';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Order } from '../models/order.model';
import { SmartBill } from '../models/smartbill.model';

@Injectable({
  providedIn: 'root'
})
export class SmartbillService {

  private token = config.smartbill.token;
  private username = config.smartbill.username;
  private companyVatCode = config.smartbill.companyVatCode;

  private smartbillDefaultObject: SmartBill = {
    client: {
      isTaxPayer: false,
      saveToDb: false,
      country: "Romania",
    },
    seriesName: "integration",
    isDraft: false,
    currency: "RON",
    language: "RO",
    products: [{
      code: "NoCode",
      productDescription: "N/a",
      isDiscount: false,
      measuringUnitName: 'N/a',
      currency: 'RO',
      quantity: 1,
      isTaxIncluded: true,
      taxName: 'N/a',
      taxPercentage: 0,
      isService: false
    }],
    payment: {
      isCash: true
    }
  }

  constructor(
    private http: HttpClient
  ) { }

  send(order: Order): Observable<any> {
    let invoice : SmartBill= {... this.smartbillDefaultObject };
    invoice.companyVatCode = this.companyVatCode
    invoice.client.name = order.name;
    invoice.client.address = `${ order.street }, ${ order.shippingNumber }`;
    invoice.client.city = order.city;
    invoice.client.county = order.county;
    invoice.client.county = order.county;
    invoice.dueDate = this.getDueDate();
    invoice.products[0].price = Number(order.shippingPrice);
    invoice.products[0].name = order.productName;

    console.log(this.getToken());
    console.log(invoice);
    return of('');
    // return this.http.post<any>('https://ws.smartbill.ro/SBORO/api/invoice', invoice, {
    //   headers: {
    //     'authorization': `Basic ${this.getToken()}`
    //   }
    // });
  }

  private getToken(): string {
    return "";  //Buffer.from(`${ this.username }:${ this.token }`).toString('base64');
  }

  private getDueDate(): string {
    const today = new Date();
    return `${ today.getFullYear() }-${ today.getMonth() !== 12 ? today.getMonth() + 1 : 1 }-${ today.getDay() }`;
  }
}
