import { IPaymentPeriod } from '../interface/payment-period';

export class PaymentPeriod implements IPaymentPeriod {
    name: string;
    amount: number;
}
