import { ICustomer } from '../interface/Customer';
import { IPayment } from '../interface/payment';

export class Customer implements ICustomer {
    id?: string;
    gender: string;
    address: string;
    expectedAmount: number;
    expectedMonth: number;
    firstName: string;
    lastName: string;
    paidAmount: number;
    paidMonth: number;
    phoneNumber: string;
    plageAmount: number;
    paymentPlan: string;
    payments: IPayment[];
    branch: string;
}
