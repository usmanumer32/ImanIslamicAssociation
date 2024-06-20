import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../providers/customer.service';
import { Subscription } from 'rxjs';
import { HelperServiceService } from 'src/app/providers/helper-service.service';
import { ICustomer } from 'src/app/interface/Customer';
import { IBranch } from 'src/app/interface/ibranch';
import { BranchService } from 'src/app/providers/branch.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastMessage } from 'src/app/model/broadcast-message.model';
import { MessageService } from 'src/app/providers/message.service';
declare var $: any;

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.scss']
})
export class UpdateCustomerComponent implements OnInit {
  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    branch: new FormControl('', [Validators.required]),
    paymentPlan: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    plageAmount: new FormControl(0, [Validators.required]),
    expectedAmount: new FormControl(0, [Validators.required]),
    expectedMonth: new FormControl(12, [Validators.required]),
    paidAmount: new FormControl(0, [Validators.required]),
    paidMonth: new FormControl(0, [Validators.required]),
  });
  paymentPlans = [];
  subscription: Subscription;
  customer: ICustomer;
  genders = ['Male', 'Female'];
  branches: IBranch[];
  paidMonths = [];

  constructor(
    private customerService: CustomerService,
    private helperService: HelperServiceService,
    private branchService: BranchService,
    private toastService: ToastService,
    private messageService: MessageService
  ) {
    this.subscription = this.helperService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.updateCustomerSender) {
          this.customer = message.data;
          console.log(this.customer);
          this.filterPaidMonths();

          if (this.customer) {
            this.form = new FormGroup({
              firstName: new FormControl(this.customer.firstName, [Validators.required]),
              lastName: new FormControl(this.customer.lastName, [Validators.required]),
              gender: new FormControl(this.customer.gender, [Validators.required]),
              branch: new FormControl(this.customer.branch, [Validators.required]),
              paymentPlan: new FormControl(this.customer.paymentPlan, [Validators.required]),
              address: new FormControl(this.customer.address, [Validators.required]),
              phoneNumber: new FormControl(this.customer.phoneNumber, [Validators.required]),
              plageAmount: new FormControl(this.customer.plageAmount, [Validators.required]),
              expectedAmount: new FormControl(this.customer.expectedAmount, [Validators.required]),
              expectedMonth: new FormControl(this.customer.expectedMonth, [Validators.required]),
              paidAmount: new FormControl(this.customer.paidAmount, [Validators.required]),
              paidMonth: new FormControl(this.customer.paidMonth, [Validators.required]),
            });
          }
        }
      });
  }

  ngOnInit() {
    this.getPaymentPlans();
    this.getBranches();
  }

  resetCustomer() {
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      branch: new FormControl('', [Validators.required]),
      paymentPlan: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      plageAmount: new FormControl(0, [Validators.required]),
      expectedAmount: new FormControl(0, [Validators.required]),
      expectedMonth: new FormControl(12, [Validators.required]),
      paidAmount: new FormControl(0, [Validators.required]),
      paidMonth: new FormControl(0, [Validators.required]),
    });
  }

  onSubmit() {
    const customer = this.form.value as ICustomer;
    customer.id = this.customer.id;
    customer.expectedAmount = this.customer.expectedAmount;
    customer.expectedMonth = this.customer.expectedMonth;
    customer.paidMonth = this.customer.paidMonth;
    customer.paidAmount = this.customer.paidAmount;
    customer.payments = this.customer.payments;
    console.log(customer);
    this.customerService.updateCustomer(customer);
    this.toastService.success('Operation Succesful');
    $('#modalUpdateCustomer').modal('hide');
    this.resetCustomer();
  }

  getPaymentPlans() {
    this.customerService.getPaymentPlans()
      .subscribe(res => {
        this.paymentPlans = res;
      });
  }

  getBranches() {
    this.branchService.getAllBranches()
      .subscribe(res => {
        this.branches = res;
      });
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

  removePayment(month, index) {
    this.paidMonths.splice(index, 1);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.customer.payments.length; i++) {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.customer.payments[i].periods.length; j++) {
        if (this.customer.payments[i].periods[j].name === month) {

          // calculate Expected Amount
          this.customer.expectedAmount = this.customer.expectedAmount + this.customer.payments[i].periods[j].amount;
          // calculate Expected Month
          this.customer.expectedMonth = this.customer.expectedMonth + 1;
          // calculate Paid Amount
          this.customer.paidAmount = this.customer.paidAmount - this.customer.payments[i].periods[j].amount;
          // calculate Paid Month
          this.customer.paidMonth = this.customer.paidMonth - 1;
          // calculate tottal paid amount
          this.customer.payments[i].paidAmount = this.customer.payments[i].paidAmount - this.customer.payments[i].periods[j].amount;

          this.customer.payments[i].periods.splice(j, 1);
          if (this.customer.payments[i].periods.length === 0) {
            this.customer.payments.splice(i, 1);
          }
          if (this.customer.payments.length === 0) {
            const obj = {
              periods: [
                {
                  name: '',
                  amount: 0
                }
              ],
              paidAmount: 0
            };
            this.customer.payments.push(obj);
          }
          break;
        }
      }
    }
    console.log(this.customer);
  }

}
