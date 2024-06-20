import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IBroadcast } from '../interface/ibroadcast';

@Injectable({
  providedIn: 'root'
})
export class HelperServiceService implements IBroadcast {
  subject = new Subject<any>();
  months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor() { }

  getMonths() {
    return this.months;
  }

  broadcastTask(message: any): void {
    this.subject.next(message);
  }

  subscribeTask(): Observable<any> {
    return this.subject.asObservable();
  }
}
