import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';

export type DeliveryType = 'pickup' | 'delivery' | 'agreement';

export type PaymentMethod =
    | 'google_pay_simulation'
    | 'card_simulation'
    | 'cash_on_delivery';

export type PaymentStatus =
    | 'pending'
    | 'processing'
    | 'requires_action'
    | 'paid_test'
    | 'failed'
    | 'cancelled';

export type OrderStatus =
    | 'awaiting_payment'
    | 'paid'
    | 'cancelled'
    | 'failed';

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

export interface PaymentDelivery {
    type: DeliveryType;
    city?: string;
    address?: string;
    receiverName?: string;
    phone?: string;
    comment?: string;
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

    item: string | PaymentItem;
    buyer: string | PaymentUser;
    seller: string | PaymentUser;

    amount: number;
    serviceFee: number;
    totalAmount: number;
    currency: string;

    delivery: PaymentDelivery;

    method: PaymentMethod;
    status: PaymentStatus;
    orderStatus: OrderStatus;

    providerPaymentId?: string | null;
    mockTransactionId?: string | null;

    cardInfo?: PaymentCardInfo;
    googlePayInfo?: GooglePayInfo;

    failureReason?: string | null;
    paidAt?: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface CreateCheckoutPayload {
    itemId: string;
    method: PaymentMethod;

    deliveryType: DeliveryType;
    deliveryCity?: string;
    deliveryAddress?: string;
    receiverName?: string;
    buyerPhone?: string;
    buyerComment?: string;
}

export interface PaymentResponse {
    message: string;
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

    static createCheckout = async (
        token: string,
        payload: CreateCheckoutPayload,
    ): Promise<Payment> => {
        try {
            const response = await api.post(
                '/payments/checkout',
                payload,
                {
                    headers: this.getAuthHeaders(token),
                },
            );

            return response.data.payment;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getPaymentById = async (
        token: string,
        paymentId: string,
    ): Promise<Payment> => {
        try {
            const response = await api.get(
                `/payments/${paymentId}`,
                {
                    headers: this.getAuthHeaders(token),
                },
            );

            return response.data.payment;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static payWithGooglePay = async (
        token: string,
        paymentId: string,
        paymentData: any,
    ): Promise<PaymentResponse> => {
        try {
            const response = await api.post(
                `/payments/${paymentId}/google-pay`,
                {
                    paymentData,
                },
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
        paymentId: string,
        cardNumber: string,
    ): Promise<CardSimulationResponse> => {
        try {
            const response = await api.post(
                `/payments/${paymentId}/card-simulation`,
                {
                    cardNumber,
                },
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
        paymentId: string,
        code: string,
    ): Promise<PaymentResponse> => {
        try {
            const response = await api.post(
                `/payments/${paymentId}/confirm-3ds`,
                {
                    code,
                },
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
        paymentId: string,
    ): Promise<PaymentResponse> => {
        try {
            const response = await api.patch(
                `/payments/${paymentId}/cancel`,
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

    static getMyPayments = async (
        token: string,
    ): Promise<Payment[]> => {
        try {
            const response = await api.get('/payments/my', {
                headers: this.getAuthHeaders(token),
            });

            return response.data.payments;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getMySalesPayments = async (
        token: string,
    ): Promise<Payment[]> => {
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