import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';

class PaymentService {
    private static getAuthHeaders(token: string) {
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    static createPayment = async (token: string, itemId: string) => {
        try {
            const response = await api.post(
                '/payments',
                {
                    itemId,
                    method: 'google_pay_simulation',
                },
                {
                    headers: this.getAuthHeaders(token),
                },
            );

            return response.data.payment;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static simulatePayment = async (
        token: string,
        paymentId: string,
        cardNumber: string,
    ) => {
        try {
            const response = await api.post(
                `/payments/${paymentId}/simulate`,
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
    ) => {
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
}

export default PaymentService;