'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import CheckoutService from '@/services/CheckoutService';
import PaymentService, {
    Payment,
    PaymentItem,
    PaymentMethod, PaymentResponse,
    PaymentStatus, PaymentUser,
} from '@/services/PaymentService';
import { getAuthToken } from '@/Utils/authToken';
const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
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
import ReviewModal from "@/components/ReviewModal/ReviewModal";

declare global {
    interface Window {
        google?: any;
    }
}

type DeliveryType = 'pickup' | 'delivery' | 'agreement';
type CheckoutPaymentStatus = 'pending' | 'processing' | 'paid_test' | 'failed' | 'cancelled';
type CheckoutStatus = 'awaiting_payment' | 'paid' | 'failed' | 'cancelled';
type DisplayStatus = PaymentStatus | 'pending';

interface CheckoutDelivery {
    type: DeliveryType;
    city?: string;
    address?: string;
    receiverName?: string;
    phone?: string;
    comment?: string;
}

interface Checkout {
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

const paymentSteps = [
    'Очікування підтвердження',
    'Перевірка платіжних даних',
    'Імітація відповіді банку',
    'Фіксація тестової транзакції',
];

const failedStepStyle = {
    color: '#bd4242',
    background: '#fff5f5',
    borderColor: 'rgba(212, 91, 91, 0.35)',
};

const failedStepMarkerStyle = {
    color: '#ffffff',
    background: '#d45b5b',
};

function formatPrice(value: number) {
    return new Intl.NumberFormat('uk-UA').format(value);
}

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || error?.message || fallback;
}

function getPaymentItem(checkout: Checkout | null): PaymentItem | null {
    if (!checkout || typeof checkout.item === 'string') return null;

    return checkout.item;
}

function getCheckoutPayment(checkout: Checkout | null): Payment | null {
    if (!checkout?.payment || typeof checkout.payment === 'string') return null;

    return checkout.payment;
}

function getCurrentStatus(checkout: Checkout | null, payment: Payment | null): DisplayStatus {
    return payment?.status || checkout?.paymentStatus || 'pending';
}

function getBadgeStatus(status: DisplayStatus): PaymentStatus {
    return (status === 'pending' ? 'processing' : status) as PaymentStatus;
}

function getMethodLabel(method?: PaymentMethod) {
    if (method === 'google_pay_simulation') return 'Google Pay';
    if (method === 'card_simulation') return 'Картка';
    if (method === 'cash_on_delivery') return 'Оплата при отриманні';

    return 'Не вказано';
}

function getDeliveryLabel(type?: DeliveryType) {
    if (type === 'pickup') return 'Самовивіз';
    if (type === 'delivery') return 'Доставка';
    if (type === 'agreement') return 'За домовленістю';

    return 'Не вказано';
}

function getStatusLabel(status: DisplayStatus) {
    if (status === 'paid_test') return 'Оплачено тестово';
    if (status === 'processing') return 'Обробка';
    if (status === 'requires_action') return 'Потрібне 3DS';
    if (status === 'failed') return 'Помилка';
    if (status === 'cancelled') return 'Скасовано';

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

function getPaymentDataRequest(checkout: Checkout) {
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
            totalPrice: Number(checkout.totalAmount || 0).toFixed(2),
            currencyCode: checkout.currency || 'UAH',
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
    const activeStepRef = useRef(0);

    const [checkout, setCheckout] = useState<Checkout | null>(null);
    const [cardNumber, setCardNumber] = useState('');
    const [threeDsCode, setThreeDsCode] = useState('');

    const [activeStep, setActiveStep] = useState(0);
    const [failedStep, setFailedStep] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGooglePayReady, setIsGooglePayReady] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const payment = useMemo(() => getCheckoutPayment(checkout), [checkout]);
    const item = useMemo(() => getPaymentItem(checkout), [checkout]);
    const currentStatus = getCurrentStatus(checkout, payment);
    const isPaid = currentStatus === 'paid_test' || checkout?.checkoutStatus === 'paid';
    const renderedFailedStep = failedStep ?? (currentStatus === 'failed' ? paymentSteps.length - 1 : null);

    useEffect(() => {
        activeStepRef.current = activeStep;
    }, [activeStep]);

    useEffect(() => {
        async function loadCheckout() {
            const token = getAuthToken();

            if (!token) {
                router.replace('/registration');
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                const data = await CheckoutService.getCheckoutById(token, params.paymentid);

                setCheckout(data);

                if (data.paymentStatus === 'paid_test') {
                    setSuccess('Оплату вже підтверджено');
                    setActiveStep(paymentSteps.length - 1);
                }

                if (data.paymentStatus === 'failed') {
                    setFailedStep(paymentSteps.length - 1);
                }
            } catch (e: any) {
                setError(getErrorMessage(e, 'Не вдалося завантажити checkout'));
            } finally {
                setIsLoading(false);
            }
        }

        if (params.paymentid) {
            loadCheckout();
        }
    }, [params.paymentid, router]);

    useEffect(() => {
        async function initGooglePay() {
            if (!checkout || checkout.paymentMethod !== 'google_pay_simulation') return;
            if (isPaid || currentStatus === 'failed' || currentStatus === 'cancelled') return;

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
    }, [checkout?._id, checkout?.paymentMethod, currentStatus, isPaid]);

    function runVisualSteps() {
        setActiveStep(0);
        activeStepRef.current = 0;
        setFailedStep(null);

        const timers = paymentSteps.slice(1).map((_, index) => {
            const step = index + 1;

            return window.setTimeout(() => {
                activeStepRef.current = step;
                setActiveStep(step);
            }, step * 420);
        });

        return () => {
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }

    function markFailedStep(fallbackStep: number) {
        const step = Math.min(
            Math.max(activeStepRef.current, fallbackStep),
            paymentSteps.length - 1,
        );

        setFailedStep(step);
    }

    function handleGooglePayClick() {
        if (!checkout || !paymentsClientRef.current) return;

        setError('');
        setSuccess('');

        const paymentDataRequest = getPaymentDataRequest(checkout);

        paymentsClientRef.current
            .loadPaymentData(paymentDataRequest)
            .then(handleGooglePayData)
            .catch((e: any) => {
                if (e?.statusCode === 'CANCELED') return;

                markFailedStep(0);
                setError('Оплату через Google Pay не завершено');
            });
    }

    async function handleGooglePayData(paymentData: any) {
        const token = getAuthToken();

        if (!token || !checkout) {
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
                checkout._id,
                paymentData,
            );

            clearSteps();

            setCheckout(response.checkout);
            setActiveStep(paymentSteps.length - 1);
            setFailedStep(null);
            setSuccess(response.message || 'Google Pay оплату успішно імітовано');
        } catch (e: any) {
            markFailedStep(2);
            setError(getErrorMessage(e, 'Не вдалося провести Google Pay оплату'));
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleCardSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = getAuthToken();

        if (!token || !checkout) {
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
                checkout._id,
                cardNumber,
            );

            clearSteps();

            setCheckout(response.checkout);

            if (response.requiresAction) {
                setActiveStep(2);
                setFailedStep(null);
                setSuccess('Потрібне 3DS-підтвердження. Введіть код 111111.');
                return;
            }

            setActiveStep(paymentSteps.length - 1);
            setFailedStep(null);
            setSuccess(response.message || 'Оплату карткою успішно імітовано');
        } catch (e: any) {
            markFailedStep(1);
            setError(getErrorMessage(e, 'Не вдалося провести оплату карткою'));
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleConfirm3DS() {
        const token = getAuthToken();

        if (!token || !checkout) {
            router.replace('/registration');
            return;
        }

        try {
            setIsProcessing(true);
            setError('');
            setSuccess('');

            const response = await PaymentService.confirm3DS(
                token,
                checkout._id,
                threeDsCode,
            );

            setCheckout(response.checkout);
            setActiveStep(paymentSteps.length - 1);
            setFailedStep(null);
            setSuccess(response.message || '3DS підтверджено');
        } catch (e: any) {
            markFailedStep(2);
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

    if (error && !checkout) {
        return (
            <Page>
                <PageContainer>
                    <LoadingCard>{error}</LoadingCard>
                </PageContainer>
            </Page>
        );
    }

    if (!checkout) return null;

    return (
        <Page>
            <PageContainer>
                <PageHeader>
                    <div>
                        <PageTitle>Local Market Pay</PageTitle>
                        <PageDescription>
                            Реалістична імітація оплати для навчального маркетплейсу.
                            Реальні кошти не списуються.
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
                        <PaymentStatusBadge $status={getBadgeStatus(currentStatus)}>
                            {getStatusLabel(currentStatus)}
                        </PaymentStatusBadge>

                        <h2>
                            {isPaid ? 'Оплату підтверджено' : 'Оплата замовлення'}
                        </h2>

                        <p>
                            Сума до оплати:{' '}
                            <strong>
                                {formatPrice(Number(checkout.totalAmount || 0))}{' '}
                                {checkout.currency}
                            </strong>
                        </p>

                        <StepsList>
                            {paymentSteps.map((step, index) => {
                                const isFailedStep = renderedFailedStep === index;
                                const isCompletedStep = isPaid
                                    || (renderedFailedStep === null
                                        ? index <= activeStep
                                        : index < renderedFailedStep);

                                return (
                                    <StepItem
                                        key={step}
                                        $active={isCompletedStep}
                                        style={isFailedStep ? failedStepStyle : undefined}
                                    >
                                        <span style={isFailedStep ? failedStepMarkerStyle : undefined}>
                                            {index + 1}
                                        </span>
                                        {step}
                                    </StepItem>
                                );
                            })}
                        </StepsList>

                        {checkout.paymentMethod === 'google_pay_simulation' && !isPaid && (
                            <GooglePayBox>
                                <div ref={googlePayButtonRef} />

                                {!isGooglePayReady && (
                                    <PrimaryButton type="button" disabled>
                                        Google Pay недоступний
                                    </PrimaryButton>
                                )}
                            </GooglePayBox>
                        )}

                        {checkout.paymentMethod === 'card_simulation' && !isPaid && (
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

                                {currentStatus === 'requires_action' && (
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

                        {checkout.paymentMethod === 'cash_on_delivery' && (
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
                                    onClick={() => setIsReviewModalOpen(true)}
                                >
                                    Залишити відгук продавцю
                                </SecondaryButton>

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
                            <strong>{getMethodLabel(checkout.paymentMethod)}</strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Доставка</span>
                            <strong>{getDeliveryLabel(checkout.delivery?.type)}</strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Місто</span>
                            <strong>{checkout.delivery?.city || 'Не вказано'}</strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Отримувач</span>
                            <strong>
                                {checkout.delivery?.receiverName || 'Не вказано'}
                            </strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Товар</span>
                            <strong>
                                {formatPrice(Number(checkout.amount || 0))}{' '}
                                {checkout.currency}
                            </strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Комісія</span>
                            <strong>
                                {formatPrice(Number(checkout.serviceFee || 0))}{' '}
                                {checkout.currency}
                            </strong>
                        </SummaryLine>

                        <SummaryLine $total>
                            <span>Разом</span>
                            <strong>
                                {formatPrice(Number(checkout.totalAmount || 0))}{' '}
                                {checkout.currency}
                            </strong>
                        </SummaryLine>

                        {payment?.mockTransactionId && (
                            <InfoCard>
                                <span>Тестова транзакція</span>
                                <strong>{payment.mockTransactionId}</strong>
                            </InfoCard>
                        )}

                        {payment?.failureReason && (
                            <InfoCard>
                                <span>Причина помилки</span>
                                <strong>{payment.failureReason}</strong>
                            </InfoCard>
                        )}
                    </SummaryCard>
                </PaymentGrid>
            </PageContainer>
            <ReviewModal
                isOpen={isReviewModalOpen}
                token={getAuthToken()}
                targetUserId={typeof checkout.seller === 'string' ? checkout.seller : checkout.seller._id}
                targetUserName={typeof checkout.seller === 'string' ? 'Продавець' : checkout.seller.username}
                itemId={item?._id}
                itemName={item?.name}
                onClose={() => setIsReviewModalOpen(false)}
                onSuccess={() => {
                    setError('');
                    setSuccess('Відгук додано');
                }}
            />
        </Page>
    );
}