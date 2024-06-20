import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../providers/customer.service';
import { ICustomer } from '../../interface/Customer';
import { HelperServiceService } from '../../providers/helper-service.service';
import { SpinnerService } from '../../providers/spinner.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastMessage } from 'src/app/model/broadcast-message.model';
import { MessageService } from 'src/app/providers/message.service';
import { DialogMessage } from 'src/app/model/dialog-message.model';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { BranchService } from 'src/app/providers/branch.service';
import { IBranch } from 'src/app/interface/ibranch';
declare var $: any;

export interface PeriodicElement {
  position: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  plageAmount: number;
  paidMonth: number;
  expectedMonth: number;
  paidAmount: number;
  expectedAmount: number;
  paymentPlan: string;
  gender: string;
  branch: string;
}

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {
  customers: ICustomer[];
  index: number;
  subscription: Subscription;
  displayedColumns: string[] = ['position', 'firstName', 'phoneNumber', 'address', 'plageAmount', 'paymentPlan',
    'gender', 'branch', 'actions'];
  searchText: string;
  matchNotFound = false;
  branches: IBranch[];

  constructor(
    private customerService: CustomerService,
    private helperService: HelperServiceService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private messageService: MessageService,
    private branchService: BranchService
  ) {
    this.subscription = this.helperService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        console.log('wuy');
        if (message.sender === this.messageService.customerDeleteSender && message.data === true) {
          this.deleteCustomer(this.customers[this.index]);
        }
      });
  }

  ngOnInit() {
    this.spinnerService.show();
    this.branchService.getAllBranches()
    .subscribe(res => {
      this.branches = res;
      this.searchText = this.branches[0].name;
      this.getCustomerByBranch();
    });
  }

  deleteCustomer(customer: ICustomer) {
    console.log('wiyyyyyy');
    this.customerService.deleteCustomer(customer);
    this.toastService.success('Operation Succesful');
  }

  dialogDeleteCustomer(index) {
    this.index = index;

    this.helperService.broadcastTask(new BroadcastMessage(this.messageService.dialogDataSender,
      new DialogMessage(`Are you sure you want to delete <b>${this.customers[index].firstName} ${this.customers[index].lastName}</b>?`,
        this.messageService.customerDeleteSender)));
  }

  updateCustomer(customer: ICustomer) {
    const message = new BroadcastMessage(this.messageService.updateCustomerSender, customer);
    this.helperService.broadcastTask(message);
    $('#modalUpdateCustomer').modal('show');
  }

  viewCustomer(customer) {
    const message = new BroadcastMessage(this.messageService.viewCustomerSender, customer);
    this.helperService.broadcastTask(message);
    this.helperService.broadcastTask(customer);
    $('#modalViewCustomer').modal('show');
  }

  getCustomerByBranch() {
    this.customerService.searchCustomerByBranch(this.searchText, this.searchText)
      .subscribe(res => {
        if (res.length === 0) {
          this.matchNotFound = true;
          this.customers = res;
        } else {
          this.customers = res;
          this.matchNotFound = false;
        }
        this.spinnerService.hide();
      });
  }

}
