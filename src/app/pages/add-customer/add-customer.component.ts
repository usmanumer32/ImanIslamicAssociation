import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../providers/customer.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../providers/toast.service';
import { ICustomer } from '../../interface/Customer';
import { BranchService } from 'src/app/providers/branch.service';
import { IBranch } from 'src/app/interface/ibranch';
declare var $: any;

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  paymentPlans = [];
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
  branches: IBranch[];
  genders = ['Male', 'Female'];
  durationInSeconds = 5;

  constructor(
    private customerService: CustomerService,
    private branchService: BranchService,
    private toastService: ToastService
  ) {
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

  onSubmit() {
    const customer = this.form.value as ICustomer;
    customer.expectedAmount = customer.plageAmount * 12;
    customer.payments = [
      {
        periods: [
          {
            name: '',
            amount: 0
          }
        ],
        paidAmount: 0
      }
    ];
    this.customerService.addCustomer(customer);
    $('#modalCrateCustomer').modal('hide');
    this.resetCustomer();
    this.toastService.success('Operation Succesful');
  }

}
