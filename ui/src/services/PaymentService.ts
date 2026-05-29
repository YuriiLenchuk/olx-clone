import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';

export type DeliveryType = 'pickup' | 'delivery' | 'agreement';

export type PaymentMethod =
    | 'google_pay_simulation'
    | 'card_simulation'
    | 'cash_on_delivery';

export type PaymentStatus =
    | 'processing'
    | 'requires_action'
    | 'paid_test'
    | 'failed'
    | 'cancelled';

export type CheckoutPaymentStatus =
    | 'pending'
    | 'processing'
    | 'paid_test'
    | 'failed'
    | 'cancelled';

export type CheckoutStatus =
    | 'awaiting_payment'
    | 'paid'
    | 'failed'
    | 'cancelled';

export interface PaymentUser {
    _id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    city?: string;
    avatar?: string;
}

export interface PaymentItem {
    _id: string;
    name: string;
    price: number;
    img?: string[];
    location?: string;
    description?: string;
    owner?: string | PaymentUser;
}

export interface CheckoutDelivery {
    type: DeliveryType;
    city?: string;
    address?: string;
    receiverName?: string;
    phone?: string;
    comment?: string;
}

export interface Checkout {
    _id: string;
    item: string | PaymentItem;
    buyer: string | PaymentUser;
    seller: string | PaymentUser;

    amount: number;
    serviceFee: number;
    totalAmount: number;
    currency: string;

    delivery: CheckoutDelivery;

    paymentMethod: PaymentMethod;
    paymentStatus: CheckoutPaymentStatus;
    checkoutStatus: CheckoutStatus;

    payment?: string | Payment | null;
    paidAt?: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface PaymentCardInfo {
    brand?: string | null;
    last4?: string | null;
}

export interface GooglePayInfo {
    cardNetwork?: string | null;
    cardDetails?: string | null;
    description?: string | null;
}

export interface Payment {
    _id: string;

    checkout: string | Checkout;
    item: string | PaymentItem;
    buyer: string | PaymentUser;
    seller: string | PaymentUser;

    amount: number;
    currency: string;

    method: PaymentMethod;
    status: PaymentStatus;

    mockTransactionId?: string | null;

    cardInfo?: PaymentCardInfo;
    googlePayInfo?: GooglePayInfo;

    failureReason?: string | null;
    paidAt?: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface PaymentResponse {
    message: string;
    checkout: Checkout;
    payment: Payment;
}

export interface CardSimulationResponse extends PaymentResponse {
    requiresAction?: boolean;
}

class PaymentService {
    private static getAuthHeaders(token: string) {
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    static getPaymentById = async (
        token: string,
        paymentId: string,
    ): Promise<Payment> => {
        try {
            const response = await api.get(`/payments/${paymentId}`, {
                headers: this.getAuthHeaders(token),
            });

            return response.data.payment;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static payWithGooglePay = async (
        token: string,
        checkoutId: string,
        paymentData: any,
    ): Promise<PaymentResponse> => {
        try {
            const response = await api.post(
                `/payments/${checkoutId}/google-pay`,
                { paymentData },
                {
                    headers: this.getAuthHeaders(token),
                },
            );

            return response.data;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static simulateCardPayment = async (
        token: string,
        checkoutId: string,
        cardNumber: string,
    ): Promise<CardSimulationResponse> => {
        try {
            const response = await api.post(
                `/payments/${checkoutId}/card-simulation`,
                { cardNumber },
                {
                    headers: this.getAuthHeaders(token),
                },
            );

            return response.data;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static confirm3DS = async (
        token: string,
        checkoutId: string,
        code: string,
    ): Promise<PaymentResponse> => {
        try {
            const response = await api.post(
                `/payments/${checkoutId}/confirm-3ds`,
                { code },
                {
                    headers: this.getAuthHeaders(token),
                },
            );

            return response.data;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static cancelPayment = async (
        token: string,
        checkoutId: string,
    ): Promise<PaymentResponse> => {
        try {
            const response = await api.patch(
                `/payments/${checkoutId}/cancel`,
                {},
                {
                    headers: this.getAuthHeaders(token),
                },
            );

            return response.data;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getMyPayments = async (token: string): Promise<Payment[]> => {
        try {
            const response = await api.get('/payments/my', {
                headers: this.getAuthHeaders(token),
            });

            return response.data.payments;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getMySalesPayments = async (token: string): Promise<Payment[]> => {
        try {
            const response = await api.get('/payments/sales', {
                headers: this.getAuthHeaders(token),
            });

            return response.data.payments;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export default PaymentService;