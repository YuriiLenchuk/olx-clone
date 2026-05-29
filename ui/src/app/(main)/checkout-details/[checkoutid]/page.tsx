'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import CheckoutService from '@/services/CheckoutService';
import ChatService from '@/services/ChatService';
import PaymentService, {
    Checkout,
    Payment,
    PaymentItem,
    PaymentUser,
} from '@/services/PaymentService';
import { getAuthToken } from '@/Utils/authToken';

import {
    ActionBar,
    BackButton,
    DetailGrid,
    EmptyPhoto,
    ErrorBox,
    Header,
    InfoBlock,
    ItemImage,
    ItemPreview,
    Page,
    PageContainer,
    PrimaryButton,
    SecondaryButton,
    StatusBadge,
    SummaryCard,
    SummaryLine,
} from './styled';

const IMAGE_URL = 'http://localhost:3005/img/';

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || error?.message || fallback;
}

function formatPrice(value?: number) {
    return new Intl.NumberFormat('uk-UA').format(Number(value || 0));
}

function getCurrentUserId(token: string) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        return payload.id || '';
    } catch {
        return '';
    }
}

function getCheckoutItem(checkout: Checkout | null): PaymentItem | null {
    if (!checkout || typeof checkout.item === 'string') return null;

    return checkout.item;
}

function getCheckoutPayment(checkout: Checkout | null): Payment | null {
    if (!checkout?.payment || typeof checkout.payment === 'string') return null;

    return checkout.payment;
}

function getUserName(user?: string | PaymentUser) {
    if (!user || typeof user === 'string') return 'Користувач';

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    return fullName || user.username || 'Користувач';
}

function getDeliveryLabel(type?: string) {
    if (type === 'pickup') return 'Самовивіз';
    if (type === 'delivery') return 'Доставка';
    if (type === 'agreement') return 'За домовленістю';

    return 'Не вказано';
}

function getPaymentMethodLabel(method?: string) {
    if (method === 'google_pay_simulation') return 'Google Pay';
    if (method === 'card_simulation') return 'Картка';
    if (method === 'cash_on_delivery') return 'Оплата при отриманні';

    return 'Не вказано';
}

function getStatusLabel(checkout: Checkout | null, payment: Payment | null) {
    const status = payment?.status || checkout?.paymentStatus;

    if (status === 'paid_test') return 'Оплачено';
    if (status === 'processing') return 'Обробка';
    if (status === 'requires_action') return 'Очікує 3DS';
    if (status === 'failed') return 'Помилка';
    if (status === 'cancelled') return 'Скасовано';

    return 'Очікує оплати';
}

function getStatusTone(checkout: Checkout | null, payment: Payment | null) {
    const status = payment?.status || checkout?.paymentStatus;

    if (status === 'paid_test') return 'success';
    if (status === 'failed' || status === 'cancelled') return 'danger';

    return 'warning';
}

export default function CheckoutDetailsPage() {
    const router = useRouter();
    const params = useParams<{ checkoutid: string }>();

    const [checkout, setCheckout] = useState<Checkout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [error, setError] = useState('');

    const token = useMemo(() => getAuthToken() || '', []);
    const currentUserId = useMemo(() => getCurrentUserId(token), [token]);

    const item = useMemo(() => getCheckoutItem(checkout), [checkout]);
    const payment = useMemo(() => getCheckoutPayment(checkout), [checkout]);

    const isBuyer = checkout
        ? typeof checkout.buyer === 'string'
            ? String(checkout.buyer) === String(currentUserId)
            : String(checkout.buyer?._id) === String(currentUserId)
        : false;

    const canCancel =
        checkout?.paymentStatus !== 'paid_test' &&
        checkout?.paymentStatus !== 'cancelled' &&
        checkout?.checkoutStatus !== 'paid' &&
        checkout?.checkoutStatus !== 'cancelled';

    useEffect(() => {
        async function loadCheckout() {
            if (!token) {
                router.replace('/registration');
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                const data = await CheckoutService.getCheckoutById(
                    token,
                    params.checkoutid,
                );

                setCheckout(data);
            } catch (e: any) {
                setError(getErrorMessage(e, 'Не вдалося завантажити деталі угоди'));
            } finally {
                setIsLoading(false);
            }
        }

        if (params.checkoutid) {
            loadCheckout();
        }
    }, [params.checkoutid, router, token]);

    async function handleContactSeller() {
        if (!token || !item?._id) {
            router.replace('/registration');
            return;
        }

        try {
            const chat = await ChatService.createOrGetChat(token, item._id);

            router.push(`/chats/${chat._id}`);
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося створити чат із продавцем'));
        }
    }

    async function handleCancelCheckout() {
        if (!checkout || !canCancel) return;

        const confirmed = window.confirm('Скасувати цю угоду?');

        if (!confirmed) return;

        try {
            setIsCancelling(true);
            setError('');

            const response = await PaymentService.cancelPayment(token, checkout._id);

            setCheckout(response.checkout);
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося скасувати угоду'));
        } finally {
            setIsCancelling(false);
        }
    }

    if (isLoading) {
        return (
            <Page>
                <PageContainer>
                    <SummaryCard>Завантаження деталей угоди...</SummaryCard>
                </PageContainer>
            </Page>
        );
    }

    if (error && !checkout) {
        return (
            <Page>
                <PageContainer>
                    <ErrorBox>{error}</ErrorBox>
                </PageContainer>
            </Page>
        );
    }

    if (!checkout) return null;

    return (
        <Page>
            <PageContainer>
                <Header>
                    <div>
                        <span>Деталі угоди</span>
                        <h1>{item?.name || 'Оголошення'}</h1>
                    </div>

                    <StatusBadge $tone={getStatusTone(checkout, payment)}>
                        {getStatusLabel(checkout, payment)}
                    </StatusBadge>
                </Header>

                {error && <ErrorBox>{error}</ErrorBox>}

                <DetailGrid>
                    <div>
                        <SummaryCard>
                            <ItemPreview>
                                {item?.img?.[0] ? (
                                    <ItemImage src={`${IMAGE_URL}${item.img[0]}`} alt={item.name} />
                                ) : (
                                    <EmptyPhoto>Фото немає</EmptyPhoto>
                                )}

                                <div>
                                    <span>Товар</span>
                                    <strong>{item?.name || 'Оголошення'}</strong>
                                    <p>
                                        {formatPrice(checkout.amount)} {checkout.currency}
                                    </p>
                                </div>
                            </ItemPreview>

                            <ActionBar>
                                {item?._id && (
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => router.push(`/obyava/${item._id}`)}
                                    >
                                        Переглянути товар
                                    </SecondaryButton>
                                )}

                                {isBuyer && item?._id && (
                                    <PrimaryButton type="button" onClick={handleContactSeller}>
                                        Написати продавцю
                                    </PrimaryButton>
                                )}

                                <BackButton type="button" onClick={() => router.push('/auth/me')}>
                                    У кабінет
                                </BackButton>
                            </ActionBar>
                        </SummaryCard>
                        <SummaryCard>
                            <h2>Доставка</h2>

                            <SummaryLine>
                                <span>Тип</span>
                                <strong>{getDeliveryLabel(checkout.delivery?.type)}</strong>
                            </SummaryLine>

                            <SummaryLine>
                                <span>Місто</span>
                                <strong>{checkout.delivery?.city || 'Не вказано'}</strong>
                            </SummaryLine>

                            <SummaryLine>
                                <span>Адреса</span>
                                <strong>{checkout.delivery?.address || 'Не вказано'}</strong>
                            </SummaryLine>

                            <SummaryLine>
                                <span>Отримувач</span>
                                <strong>{checkout.delivery?.receiverName || 'Не вказано'}</strong>
                            </SummaryLine>

                            <SummaryLine>
                                <span>Телефон</span>
                                <strong>{checkout.delivery?.phone || 'Не вказано'}</strong>
                            </SummaryLine>

                            {checkout.delivery?.comment && (
                                <InfoBlock>
                                    <span>Коментар</span>
                                    <strong>{checkout.delivery.comment}</strong>
                                </InfoBlock>
                            )}
                        </SummaryCard>
                    </div>

                    <div>
                        <SummaryCard>
                            <h2>Оплата</h2>

                            <SummaryLine>
                                <span>Спосіб</span>
                                <strong>{getPaymentMethodLabel(checkout.paymentMethod)}</strong>
                            </SummaryLine>

                            <SummaryLine>
                                <span>Статус</span>
                                <strong>{getStatusLabel(checkout, payment)}</strong>
                            </SummaryLine>

                            <SummaryLine>
                                <span>Товар</span>
                                <strong>
                                    {formatPrice(checkout.amount)} {checkout.currency}
                                </strong>
                            </SummaryLine>

                            <SummaryLine>
                                <span>Комісія</span>
                                <strong>
                                    {formatPrice(checkout.serviceFee)} {checkout.currency}
                                </strong>
                            </SummaryLine>

                            <SummaryLine $total>
                                <span>Разом</span>
                                <strong>
                                    {formatPrice(checkout.totalAmount)} {checkout.currency}
                                </strong>
                            </SummaryLine>

                            {payment?.mockTransactionId && (
                                <InfoBlock>
                                    <span>Тестова транзакція</span>
                                    <strong>{payment.mockTransactionId}</strong>
                                </InfoBlock>
                            )}

                            {payment?.failureReason && (
                                <InfoBlock $danger>
                                    <span>Причина помилки</span>
                                    <strong>{payment.failureReason}</strong>
                                </InfoBlock>
                            )}

                            {canCancel && (
                                <SecondaryButton
                                    type="button"
                                    onClick={handleCancelCheckout}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? 'Скасування...' : 'Скасувати угоду'}
                                </SecondaryButton>
                            )}
                        </SummaryCard>
                        <SummaryCard>
                            <h2>Учасники</h2>

                            <SummaryLine>
                                <span>Покупець</span>
                                <strong>{getUserName(checkout.buyer)}</strong>
                            </SummaryLine>

                            <SummaryLine>
                                <span>Продавець</span>
                                <strong>{getUserName(checkout.seller)}</strong>
                            </SummaryLine>
                        </SummaryCard>
                    </div>
                </DetailGrid>
            </PageContainer>
        </Page>
    );
}