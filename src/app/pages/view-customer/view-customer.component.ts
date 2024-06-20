import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HelperServiceService } from '../../providers/helper-service.service';
import { ICustomer } from 'src/app/interface/Customer';
import { BroadcastMessage } from 'src/app/model/broadcast-message.model';
import { MessageService } from 'src/app/providers/message.service';
import { CustomerService } from 'src/app/providers/customer.service';
import { ToastService } from 'src/app/providers/toast.service';
import { DialogMessage } from 'src/app/model/dialog-message.model';
declare var $: any;

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.scss']
})
export class ViewCustomerComponent implements OnInit {
  subscription: Subscription;
  customer: ICustomer;
  paidMonths = [];
  showPayBtn = true;

  constructor(
    private helperService: HelperServiceService,
    private messageService: MessageService,
    private customerService: CustomerService,
    private toastService: ToastService
  ) {
    this.subscription = this.helperService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.viewCustomerSender) {
          this.customer = message.data;
          if (this.customer.expectedAmount === 0) {
            this.showPayBtn = false;
          } else {
            this.showPayBtn = true;
          }
          this.filterPaidMonths();
        } else if (message.sender === this.messageService.customerViewDeleteSender && message.data === true) {
          this.deleteCustomer(this.customer);
        } else if (message.sender === this.messageService.customerViewDeleteSender && message.data === false) {
          $('#modalViewCustomer').modal('show');
        }
      });
  }

  ngOnInit() {
  }

  makePayment() {
    const message = new BroadcastMessage(this.messageService.paymentSender, this.customer);
    this.helperService.broadcastTask(message);
    $('#modalViewCustomer').modal('hide');
    $('#modalPayment').modal('show');
  }

  filterPaidMonths() {
    this.paidMonths = [];
    if (this.customer.expectedMonth < 12) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.customer.payments.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < this.customer.payments[i].periods.length; j++) {
          this.paidMonths.push(this.customer.payments[i].periods[j].name);
        }
      }
    }
  }

  updateCustomer() {
    const message = new BroadcastMessage(this.messageService.updateCustomerSender, this.customer);
    this.helperService.broadcastTask(message);
    $('#modalViewCustomer').modal('hide');
    $('#modalUpdateCustomer').modal('show');
  }

  deleteCustomer(customer: ICustomer) {
    $('#modalViewCustomer').modal('hide');
    this.customerService.deleteCustomer(customer);
    this.toastService.success('Operation Succesful');
  }

  dialogDeleteCustomer() {
    $('#modalViewCustomer').modal('hide');
    this.helperService.broadcastTask(new BroadcastMessage(this.messageService.dialogDataSender,
      new DialogMessage(`Are you sure you want to delete <b>${this.customer.firstName} ${this.customer.lastName}</b>?`,
        this.messageService.customerViewDeleteSender)));
  }

}
