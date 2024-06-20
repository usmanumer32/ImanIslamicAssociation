import { IPaymentPeriod } from '../interface/payment-period';

export interface IPayment {
    periods: IPaymentPeriod[];
    paidAmount: number;
}
