import { Component, OnInit } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { CustomerService } from '../../providers/customer.service';
import { HelperServiceService } from 'src/app/providers/helper-service.service';
import { BroadcastMessage } from 'src/app/model/broadcast-message.model';
import { MessageService } from 'src/app/providers/message.service';
declare var $: any;

@Component({
  selector: 'app-search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.scss']
})
export class SearchCustomerComponent implements OnInit {
  searchText: string;
  customers = [];
  busy = false;
  matchNotFound = false;

  startAt = new Subject();
  endAt = new Subject();

  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();

  constructor(
    private customerService: CustomerService,
    private helperService: HelperServiceService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }

  clearSearch() {
    this.searchText = '';
    this.customers = [];
  }

  search() {
    this.busy = true;
    this.startAt.next(this.searchText);
    this.endAt.next(this.searchText + '\uf8ff');
    combineLatest(this.startObs, this.endObs).subscribe((value) => {
      this.customerService.searchCustomer(value[0], value[1])
        .subscribe(res => {
          if (res.length === 0) {
            this.matchNotFound = true;
          } else {
            this.customers = res;
            this.matchNotFound = false;
          }
          this.busy = false;
        });
    });
  }

  select(customer) {
    const message = new BroadcastMessage(this.messageService.viewCustomerSender, customer);
    this.helperService.broadcastTask(message);
    $('#modalViewCustomer').modal('show');
  }

}
