import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/providers/helper-service.service';
import { Subscription } from 'rxjs';
import { ICustomer } from 'src/app/interface/Customer';
import { IPayment } from 'src/app/interface/payment';
import { CustomerService } from 'src/app/providers/customer.service';
import { PaymentNew } from 'src/app/model/payment-new.model';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastMessage } from 'src/app/model/broadcast-message.model';
import { MessageService } from 'src/app/providers/message.service';
declare var $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  form = new FormGroup({
    amount: new FormControl(0, [Validators.required]),
    months: new FormControl([], [Validators.required]),
  });
  months = [];
  subscription: Subscription;
  customer: ICustomer;

  constructor(
    private helperService: HelperServiceService,
    private customerService: CustomerService,
    private toastService: ToastService,
    private messageService: MessageService
  ) {
    this.subscription = this.helperService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.paymentSender) {
          this.customer = message.data;
          this.filterMonths();
        }
      });
  }

  ngOnInit() {
  }

  resetPayment() {
    this.form = new FormGroup({
      amount: new FormControl(0, [Validators.required]),
      months: new FormControl([], [Validators.required]),
    });
    this.months = [];
  }

  onSubmit() {
    const payment = this.form.value as PaymentNew;
    let amountForMonth = 0;
    if (this.customer.paymentPlan === 'Monthly') {
      amountForMonth = payment.amount;
    } else if (this.customer.paymentPlan === '3 Month') {
      amountForMonth = payment.amount / 3;
    } else if (this.customer.paymentPlan === '6 Month') {
      amountForMonth = payment.amount / 6;
    } else if (this.customer.paymentPlan === '1 Year') {
      amountForMonth = payment.amount / 12;
    }
    if (this.customer.payments[0].periods[0].name === '') {
      this.customer.payments[0].paidAmount = payment.amount;
      this.customer.payments[0].periods[0].name = payment.months[0];
      this.customer.payments[0].periods[0].amount = amountForMonth;
      for (let j = 1; j < payment.months.length; j++) {
        const period = { name: '', amount: 0 };
        period.name = payment.months[j];
        period.amount = amountForMonth;
        this.customer.payments[0].periods.push(period);
      }
      // calculate Expected Amount
      this.customer.expectedAmount = this.customer.expectedAmount - payment.amount;
      // calculate Expected Month
      this.customer.expectedMonth = this.customer.expectedMonth - this.customer.payments[0].periods.length;
      // calculate Paid Amount
      this.customer.paidAmount = this.customer.payments[0].paidAmount;
      // calculate Paid Month
      this.customer.paidMonth = this.customer.payments[0].periods.length;
    } else {
      const periodsArray = [];
      let period = { name: '', amount: 0 };
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < payment.months.length; i++) {
        period = { name: '', amount: 0 };
        period.name = payment.months[i];
        period.amount = amountForMonth;
        periodsArray.push(period);
      }
      const customerPeriodObj: IPayment = { periods: periodsArray, paidAmount: payment.amount };
      this.customer.payments.push(customerPeriodObj);
      // calculate expected amount
      this.customer.expectedAmount = this.customer.expectedAmount - payment.amount;
      // calculate expected month
      this.customer.expectedMonth = this.customer.expectedMonth - periodsArray.length;
      // calculate Paid Amount
      this.customer.paidAmount = this.customer.paidAmount + payment.amount;
      // calculate Paid Month
      this.customer.paidMonth = this.customer.paidMonth + periodsArray.length;
    }
    /* } */
    this.customerService.updateCustomer(this.customer);
    this.toastService.success('Operation Succesful');
    this.resetPayment();
    $('#modalPayment').modal('hide');
  }

  filterMonths() {
    const months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.customer.payments.length; i++) {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.customer.payments[i].periods.length; j++) {
        for (let k = 0; k < months.length; k++) {
          if (months[k] === this.customer.payments[i].periods[j].name) {
            months.splice(k, 1);
          }
        }
      }
    }
    this.months = [];
    this.months = months;
  }

}
