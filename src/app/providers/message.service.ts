import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  viewCustomerSender = 'view-customer';
  updateCustomerSender = 'update-customer';
  paymentSender = 'payment';
  dialogDataSender = 'dialog-data';
  customerDeleteSender = 'delete-customer';
  customerViewDeleteSender = 'delete-customer-view';
}
