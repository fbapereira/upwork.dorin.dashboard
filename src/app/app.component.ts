import { Component } from '@angular/core';

import { OrderService } from './services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public orders$ = this.orderService.orders$;

  constructor(private orderService: OrderService) {}
}
