import { IPaymentNew } from '../interface/ipayment-new';

export class PaymentNew implements IPaymentNew {
    amount: number;
    months: string[];
}
