import { IPayment } from './payment';

export interface ICustomer {
    id?: string;
    address: string;
    gender: string;
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
