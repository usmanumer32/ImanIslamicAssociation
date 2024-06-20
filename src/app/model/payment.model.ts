import { IPayment } from '../interface/payment';
import { IPaymentPeriod } from '../interface/payment-period';

export class Payment implements IPayment {
    periods: IPaymentPeriod[];
    paidAmount: number;
}
