import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { ICustomer } from '../interface/Customer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountService } from './count.service';
import { ICount } from '../interface/count';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customesCollection: AngularFirestoreCollection<ICustomer>;
  customers: Observable<ICustomer[]>;
  paymentPlans: Observable<any[]>;
  customerDoc: AngularFirestoreDocument<ICustomer>;
  searchResult: Observable<any[]>;
  count: ICount;

  constructor(
    public angularFirestore: AngularFirestore,
    private countService: CountService
  ) {
    /* this.customers = this.angularFirestore.collection('customers').valueChanges(); */
    this.countService.getCount().subscribe(res => {
      this.count = res[0];
    });
  }

  getCustomers() {
    this.customers = this.angularFirestore.collection('customers', ref => ref.limit(15)).snapshotChanges().
      pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as ICustomer;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
    return this.customers;
  }

  getPaymentPlans() {
    this.paymentPlans = this.angularFirestore.collection('paymentPlans').snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as any;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
    return this.paymentPlans;
  }

  addCustomer(customer: ICustomer) {
    this.customesCollection = this.angularFirestore.collection('customers');
    this.customesCollection.add(customer);

    this.count.count++;
    this.countService.updateCount(this.count);
  }

  deleteCustomer(customer: ICustomer) {
    console.log('called');
    this.customerDoc = this.angularFirestore.doc(`customers/${customer.id}`);
    this.customerDoc.delete();

    this.count.count--;
    this.countService.updateCount(this.count);
  }

  searchCustomer(start, end) {
    this.searchResult = this.angularFirestore.collection('customers', ref => ref.limit(5).orderBy('firstName')
      .startAt(start).endAt(end)).snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as any;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
    return this.searchResult;
  }

  updateCustomer(customer: ICustomer) {
    console.log(customer.id);
    this.customerDoc = this.angularFirestore.doc(`customers/${customer.id}`);
    this.customerDoc.update(customer);
  }

  searchCustomerByBranch(start, end) {
    this.searchResult = this.angularFirestore.collection('customers', ref => ref.limit(15).orderBy('branch')
      .startAt(start).endAt(end)).snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as any;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
    return this.searchResult;
  }
}
