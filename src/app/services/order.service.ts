import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, first, from, map, Observable, switchMap, tap } from 'rxjs';

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private collectionName = 'orders';

  constructor(
    private db: AngularFirestore,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService
  ) { }

  orders$ = this.db.collection<Order>(this.collectionName).snapshotChanges().pipe(
    map(orders => orders.map(({ payload: { doc } }) => {
      const data = doc.data();
      const id = doc.id;
      return { ...data, id } as Order;
    })),
    distinctUntilChanged(),
  );

  public save(order: Order): Observable<boolean> {
    this.spinner.show();
    return this.isOrder(order).pipe(
      first(),
      switchMap((isOrder) => isOrder ? this.update(order) : this.create(order)),
      tap(() => this.spinner.hide()),
      tap(() => this.toastrService.info("Your data has been saved in the data base", "Data saved")),
    )
  }

  private update(order: Order): Observable<boolean> {
    return this.db.collection(this.collectionName, ref => ref.where('orderId', '==', order.orderId)).snapshotChanges().pipe(
      tap((docs) => docs[0].payload.doc.ref.set({...order }, { merge: true })),
      map(() =>  true),
    );
  }

  private create(order: Order): Observable<boolean> {
    return from(this.db.collection<Order>(this.collectionName).add(order)).pipe(
      map(() => true)
    );
  }

  private isOrder(order: Order): Observable<boolean> {
    return this.db.collection(this.collectionName, ref => ref.where('orderId', '==', order.orderId)).snapshotChanges().pipe(
      map((stream) => stream.length > 0),
    );
  }
}
