import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IBranch } from '../interface/ibranch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  branchCollection: AngularFirestoreCollection<IBranch>;
  branches: Observable<IBranch[]>;

  constructor(
    public angularFirestore: AngularFirestore
  ) { }

  getAllBranches() {
    this.branches = this.angularFirestore.collection('branch').snapshotChanges().
      pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as IBranch;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
    return this.branches;
  }
}
