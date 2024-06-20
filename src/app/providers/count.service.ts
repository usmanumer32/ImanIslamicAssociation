import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICount } from '../interface/count';

@Injectable({
  providedIn: 'root'
})
export class CountService {
  countCollection: AngularFirestoreCollection<any>;
  countDoc: AngularFirestoreDocument<ICount>;
  count: Observable<ICount[]>;

  constructor(
    public angularFirestore: AngularFirestore
  ) { }

  getCount() {
    this.count = this.angularFirestore.collection('count', ref => ref.limit(5)).snapshotChanges().
      pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as ICount;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
    return this.count;
  }

  updateCount(count: ICount) {
    this.countDoc = this.angularFirestore.doc(`count/${count.id}`);
    this.countDoc.update(count);
  }
}
