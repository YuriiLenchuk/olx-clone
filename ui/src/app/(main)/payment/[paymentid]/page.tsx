'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import PaymentService, {
    Payment,
    PaymentItem,
} from '@/services/PaymentService';
import { getAuthToken } from '@/Utils/authToken';

import {
    BackButton,
    CardForm,
    ErrorMessage,
    GooglePayBox,
    InfoCard,
    LoadingCard,
    Page,
    PageContainer,
    PageDescription,
    PageHeader,
    PageTitle,
    PaymentGrid,
    PaymentPanel,
    PaymentStatusBadge,
    PrimaryButton,
    SecondaryButton,
    StepItem,
    StepsList,
    SuccessBox,
    SummaryCard,
    SummaryLine,
    TextInput,
} from './styled';

declare global {
    interface Window {
        google?: any;
    }
}

const paymentSteps = [
    'Очікування підтвердження',
    'Перевірка платіжних даних',
    'Імітація відповіді банку',
    'Фіксація тестової транзакції',
];

function formatPrice(value: number) {
    return new Intl.NumberFormat('uk-UA').format(value);
}

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || error?.message || fallback;
}

function getPaymentItem(payment: Payment | null): PaymentItem | null {
    if (!payment || typeof payment.item === 'string') return null;

    return payment.item;
}

function getMethodLabel(payment: Payment | null) {
    if (!payment) return '';

    if (payment.method === 'google_pay_simulation') {
        return 'Google Pay';
    }

    if (payment.method === 'card_simulation') {
        return 'Картка';
    }

    return 'Оплата при отриманні';
}

function getStatusLabel(payment: Payment | null) {
    if (!payment) return 'Очікування';

    if (payment.status === 'paid_test') return 'Оплачено тестово';
    if (payment.status === 'processing') return 'Обробка';
    if (payment.status === 'requires_action') return 'Потрібне 3DS';
    if (payment.status === 'failed') return 'Помилка';
    if (payment.status === 'cancelled') return 'Скасовано';

    return 'Очікує оплати';
}

function loadGooglePayScript() {
    return new Promise<void>((resolve, reject) => {
        if (window.google?.payments?.api) {
            resolve();
            return;
        }

        const existingScript = document.getElementById('google-pay-script');

        if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', reject);
            return;
        }

        const script = document.createElement('script');

        script.id = 'google-pay-script';
        script.src = 'https://pay.google.com/gp/p/js/pay.js';
        script.async = true;

        script.onload = () => resolve();
        script.onerror = reject;

        document.body.appendChild(script);
    });
}

const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
};

const allowedCardNetworks = ['VISA', 'MASTERCARD'];

const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        gateway: 'example',
        gatewayMerchantId: 'exampleGatewayMerchantId',
    },
};

const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks,
        billingAddressRequired: true,
        billingAddressParameters: {
            format: 'MIN',
            phoneNumberRequired: true,
        },
    },
};

function getIsReadyToPayRequest() {
    return {
        ...baseRequest,
        allowedPaymentMethods: [baseCardPaymentMethod],
    };
}

function getPaymentDataRequest(payment: Payment) {
    return {
        ...baseRequest,
        allowedPaymentMethods: [
            {
                ...baseCardPaymentMethod,
                tokenizationSpecification,
            },
        ],
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: Number(payment.totalAmount || 0).toFixed(2),
            currencyCode: payment.currency || 'UAH',
            countryCode: 'UA',
        },
        merchantInfo: {
            merchantName: 'Local Market',
        },
    };
}

export default function PaymentPage() {
    const router = useRouter();
    const params = useParams<{ paymentid: string }>();

    const googlePayButtonRef = useRef<HTMLDivElement | null>(null);
    const paymentsClientRef = useRef<any>(null);

    const [payment, setPayment] = useState<Payment | null>(null);
    const [cardNumber, setCardNumber] = useState('');
    const [threeDsCode, setThreeDsCode] = useState('');

    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGooglePayReady, setIsGooglePayReady] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const item = useMemo(() => getPaymentItem(payment), [payment]);

    useEffect(() => {
        async function loadPayment() {
            const token = getAuthToken();

            if (!token) {
                router.replace('/registration');
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                const data = await PaymentService.getPaymentById(
                    token,
                    params.paymentid,
                );

                setPayment(data);

                if (data.status === 'paid_test') {
                    setSuccess('Оплату вже підтверджено');
                }
            } catch (e: any) {
                setError(getErrorMessage(e, 'Не вдалося завантажити платіж'));
            } finally {
                setIsLoading(false);
            }
        }

        console.log(params)
        if (params.paymentid) {
            loadPayment();
        }
    }, [params.paymentid, router]);

    useEffect(() => {
        async function initGooglePay() {
            if (!payment || payment.method !== 'google_pay_simulation') {
                return;
            }

            if (payment.status === 'paid_test') {
                return;
            }

            try {
                await loadGooglePayScript();

                const paymentsClient = new window.google.payments.api.PaymentsClient({
                    environment: 'TEST',
                });

                paymentsClientRef.current = paymentsClient;

                const readyResponse = await paymentsClient.isReadyToPay(
                    getIsReadyToPayRequest(),
                );

                if (!readyResponse.result) {
                    setIsGooglePayReady(false);
                    setError('Google Pay недоступний у цьому браузері');
                    return;
                }

                setIsGooglePayReady(true);

                if (googlePayButtonRef.current) {
                    googlePayButtonRef.current.innerHTML = '';

                    const button = paymentsClient.createButton({
                        buttonType: 'pay',
                        buttonColor: 'black',
                        buttonSizeMode: 'fill',
                        onClick: handleGooglePayClick,
                    });

                    googlePayButtonRef.current.appendChild(button);
                }
            } catch {
                setIsGooglePayReady(false);
                setError('Не вдалося ініціалізувати Google Pay');
            }
        }

        initGooglePay();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payment?._id, payment?.method, payment?.status]);

    function runVisualSteps() {
        setActiveStep(0);

        const timers = paymentSteps.map((_, index) => {
            return window.setTimeout(() => {
                setActiveStep(index);
            }, index * 420);
        });

        return () => {
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }

    function handleGooglePayClick() {
        if (!payment || !paymentsClientRef.current) return;

        setError('');
        setSuccess('');

        const paymentDataRequest = getPaymentDataRequest(payment);

        paymentsClientRef.current
            .loadPaymentData(paymentDataRequest)
            .then(handleGooglePayData)
            .catch((e: any) => {
                if (e?.statusCode === 'CANCELED') return;

                setError('Оплату через Google Pay не завершено');
            });
    }

    async function handleGooglePayData(paymentData: any) {
        const token = getAuthToken();

        if (!token || !payment) {
            router.replace('/registration');
            return;
        }

        try {
            setIsProcessing(true);
            setError('');
            setSuccess('');

            const clearSteps = runVisualSteps();

            const response = await PaymentService.payWithGooglePay(
                token,
                payment._id,
                paymentData,
            );

            clearSteps();

            setPayment(response.payment);
            setActiveStep(paymentSteps.length - 1);
            setSuccess(response.message || 'Google Pay оплату успішно імітовано');
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося провести Google Pay оплату'));
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleCardSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = getAuthToken();

        if (!token || !payment) {
            router.replace('/registration');
            return;
        }

        try {
            setIsProcessing(true);
            setError('');
            setSuccess('');

            const clearSteps = runVisualSteps();

            const response = await PaymentService.simulateCardPayment(
                token,
                payment._id,
                cardNumber,
            );

            clearSteps();

            setPayment(response.payment);

            if (response.requiresAction) {
                setSuccess('Потрібне 3DS-підтвердження. Введіть код 111111.');
                return;
            }

            setSuccess(response.message || 'Оплату карткою успішно імітовано');
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося провести оплату карткою'));
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleConfirm3DS() {
        const token = getAuthToken();

        if (!token || !payment) {
            router.replace('/registration');
            return;
        }

        try {
            setIsProcessing(true);
            setError('');
            setSuccess('');

            const response = await PaymentService.confirm3DS(
                token,
                payment._id,
                threeDsCode,
            );

            setPayment(response.payment);
            setSuccess(response.message || '3DS підтверджено');
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося підтвердити 3DS'));
        } finally {
            setIsProcessing(false);
        }
    }

    function handleCardChange(event: ChangeEvent<HTMLInputElement>) {
        setCardNumber(event.target.value);
    }

    if (isLoading) {
        return (
            <Page>
                <PageContainer>
                    <LoadingCard>Завантаження сторінки оплати...</LoadingCard>
                </PageContainer>
            </Page>
        );
    }

    if (error && !payment) {
        return (
            <Page>
                <PageContainer>
                    <LoadingCard>{error}</LoadingCard>
                </PageContainer>
            </Page>
        );
    }

    if (!payment) return null;

    const isPaid = payment.status === 'paid_test';

    return (
        <Page>
            <PageContainer>
                <PageHeader>
                    <div>
                        <PageTitle>Local Market Pay</PageTitle>
                        <PageDescription>
                            Реалістична імітація оплати для навчального
                            маркетплейсу. Реальні кошти не списуються.
                        </PageDescription>
                    </div>

                    <BackButton
                        type="button"
                        onClick={() => router.push('/auth/me')}
                    >
                        У профіль
                    </BackButton>
                </PageHeader>

                <PaymentGrid>
                    <PaymentPanel>
                        <PaymentStatusBadge $status={payment.status}>
                            {getStatusLabel(payment)}
                        </PaymentStatusBadge>

                        <h2>{isPaid ? 'Оплату підтверджено' : 'Оплата замовлення'}</h2>

                        <p>
                            Сума до оплати:{' '}
                            <strong>
                                {formatPrice(Number(payment.totalAmount || 0))}{' '}
                                {payment.currency}
                            </strong>
                        </p>

                        <StepsList>
                            {paymentSteps.map((step, index) => (
                                <StepItem
                                    key={step}
                                    $active={index <= activeStep || isPaid}
                                >
                                    <span>{index + 1}</span>
                                    {step}
                                </StepItem>
                            ))}
                        </StepsList>

                        {payment.method === 'google_pay_simulation' && !isPaid && (
                            <GooglePayBox>
                                <div ref={googlePayButtonRef} />

                                {!isGooglePayReady && (
                                    <PrimaryButton type="button" disabled>
                                        Google Pay недоступний
                                    </PrimaryButton>
                                )}
                            </GooglePayBox>
                        )}

                        {payment.method === 'card_simulation' && !isPaid && (
                            <>
                                <CardForm onSubmit={handleCardSubmit}>
                                    <label>
                                        Номер картки для імітації
                                        <TextInput
                                            value={cardNumber}
                                            onChange={handleCardChange}
                                            placeholder="4242 4242 4242 4242"
                                        />
                                    </label>

                                    <PrimaryButton
                                        type="submit"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing
                                            ? 'Обробка...'
                                            : 'Оплатити тестово'}
                                    </PrimaryButton>
                                </CardForm>

                                {payment.status === 'requires_action' && (
                                    <CardForm>
                                        <label>
                                            3DS-код
                                            <TextInput
                                                value={threeDsCode}
                                                onChange={(event) =>
                                                    setThreeDsCode(event.target.value)
                                                }
                                                placeholder="111111"
                                            />
                                        </label>

                                        <SecondaryButton
                                            type="button"
                                            onClick={handleConfirm3DS}
                                            disabled={isProcessing}
                                        >
                                            Підтвердити 3DS
                                        </SecondaryButton>
                                    </CardForm>
                                )}
                            </>
                        )}

                        {payment.method === 'cash_on_delivery' && (
                            <SuccessBox>
                                Замовлення оформлено з оплатою при отриманні.
                            </SuccessBox>
                        )}

                        {isProcessing && (
                            <SuccessBox>Проводиться імітація платежу...</SuccessBox>
                        )}

                        {success && <SuccessBox>{success}</SuccessBox>}
                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        {isPaid && (
                            <div>
                                <SecondaryButton
                                    type="button"
                                    onClick={() => router.push('/auth/me')}
                                >
                                    Перейти в особистий кабінет
                                </SecondaryButton>
                            </div>
                        )}
                    </PaymentPanel>

                    <SummaryCard>
                        <h2>Деталі платежу</h2>

                        <InfoCard>
                            <span>Товар</span>
                            <strong>{item?.name || 'Оголошення'}</strong>
                        </InfoCard>

                        <SummaryLine>
                            <span>Спосіб оплати</span>
                            <strong>{getMethodLabel(payment)}</strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Доставка</span>
                            <strong>{payment.delivery?.type}</strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Місто</span>
                            <strong>{payment.delivery?.city || 'Не вказано'}</strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Отримувач</span>
                            <strong>
                                {payment.delivery?.receiverName || 'Не вказано'}
                            </strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Товар</span>
                            <strong>
                                {formatPrice(Number(payment.amount || 0))}{' '}
                                {payment.currency}
                            </strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Комісія</span>
                            <strong>
                                {formatPrice(Number(payment.serviceFee || 0))}{' '}
                                {payment.currency}
                            </strong>
                        </SummaryLine>

                        <SummaryLine $total>
                            <span>Разом</span>
                            <strong>
                                {formatPrice(Number(payment.totalAmount || 0))}{' '}
                                {payment.currency}
                            </strong>
                        </SummaryLine>

                        {payment.mockTransactionId && (
                            <InfoCard>
                                <span>Тестова транзакція</span>
                                <strong>{payment.mockTransactionId}</strong>
                            </InfoCard>
                        )}
                    </SummaryCard>
                </PaymentGrid>
            </PageContainer>
        </Page>
    );
}