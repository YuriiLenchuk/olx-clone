import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';

export type DeliveryType = 'pickup' | 'delivery' | 'agreement';
export type PaymentMethod =
    | 'google_pay_simulation'
    | 'card_simulation'
    | 'cash_on_delivery';

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

class CheckoutService {
    private static getAuthHeaders(token: string) {
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    static createCheckout = async (token: string, payload: CreateCheckoutPayload) => {
        try {
            const response = await api.post('/checkout', payload, {
                headers: this.getAuthHeaders(token),
            });

            return response.data.checkout;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getCheckoutById = async (token: string, checkoutId: string) => {
        try {
            const response = await api.get(`/checkout/${checkoutId}`, {
                headers: this.getAuthHeaders(token),
            });

            return response.data.checkout;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export default CheckoutService;