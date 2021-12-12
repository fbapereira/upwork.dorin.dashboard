import { first } from 'rxjs';

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { statusENUM } from '../enums/status.enum';
import { Order } from '../models/order.model';
import { OrderService } from '../services/order.service';

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

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: [''],
      street: [''],
      city: [''],
      mobile: [''],
      status: [''],
      shippingPrice: [''],
      shippingCity: [''],
      shippingStreet: [''],
      shippingNumber: [''],
      comment: [''],
      isShipped:  [false],
      isInvoiceMade: [false],
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
}
