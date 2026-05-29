'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { CategoryService, Item } from '@/services/CategoryService';
import PaymentService from '@/services/PaymentService';

import {
    Actions,
    BackButton,
    CardBrand,
    CheckoutGrid,
    ConfirmButton,
    ErrorMessage,
    Field,
    FormCard,
    GooglePayBadge,
    HelpText,
    ImageBox,
    Input,
    ItemImage,
    ItemMeta,
    ItemName,
    LoadingCard,
    OrderCard,
    Page,
    PageContainer,
    PageDescription,
    PageHeader,
    PageTitle,
    PayButton,
    Price,
    SecureBox,
    StatusMessage,
    SummaryRow,
    SummaryTitle,
    ThreeDSCard,
    TotalRow,
    type PaymentStatus,
} from './styled';

const IMAGE_URL = 'http://localhost:3005/img/';

function formatPrice(price: number) {
    return new Intl.NumberFormat('uk-UA').format(price);
}

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || error?.message || fallback;
}

export default function PaymentPage() {
    const router = useRouter();
    const params = useParams<{ itemId: string }>();

    const [item, setItem] = useState<Item | null>(null);
    const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
    const [threeDSCode, setThreeDSCode] = useState('');
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [requires3DS, setRequires3DS] = useState(false);

    const [isLoadingItem, setIsLoadingItem] = useState(true);
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = Cookies.get('authToken');

    useEffect(() => {
        async function loadItem() {
            try {
                setIsLoadingItem(true);
                setError('');

                const itemData = await CategoryService.getItemById(params.itemId);

                setItem(itemData);
            } catch (e: any) {
                setError(getErrorMessage(e, 'Не вдалося завантажити товар для оплати'));
            } finally {
                setIsLoadingItem(false);
            }
        }

        if (params.itemId) {
            loadItem();
        }
    }, [params.itemId]);

    const handleGooglePaySimulation = async () => {
        if (!token) {
            router.push('/registration');
            return;
        }

        if (!item) {
            setError('Товар не знайдено');
            return;
        }

        try {
            setStatus('loading');
            setError('');
            setMessage('Створення платежу...');

            const payment = await PaymentService.createPayment(token, item._id);

            setPaymentId(payment._id);
            setMessage('Обробка демонстраційного платежу...');

            const result = await PaymentService.simulatePayment(
                token,
                payment._id,
                cardNumber,
            );

            if (result.requiresAction) {
                setRequires3DS(true);
                setStatus('idle');
                setMessage('Потрібне 3DS-підтвердження. Тестовий код: 111111');
                return;
            }

            setStatus('success');
            setMessage('Оплату успішно виконано!');
        } catch (e: any) {
            setStatus('error');
            setMessage('');
            setError(getErrorMessage(e, 'Не вдалося виконати оплату'));
        }
    };

    const handleConfirm3DS = async () => {
        if (!token || !paymentId) return;

        try {
            setStatus('loading');
            setError('');
            setMessage('Перевірка 3DS-коду...');

            await PaymentService.confirm3DS(token, paymentId, threeDSCode);

            setStatus('success');
            setRequires3DS(false);
            setMessage('3DS підтверджено. Оплату виконано!');
        } catch (e: any) {
            setStatus('error');
            setMessage('');
            setError(getErrorMessage(e, 'Невірний 3DS-код'));
        }
    };

    if (isLoadingItem) {
        return (
            <Page>
                <PageContainer>
                    <LoadingCard>Завантаження сторінки оплати...</LoadingCard>
                </PageContainer>
            </Page>
        );
    }

    return (
        <Page>
            <PageContainer>
                <PageHeader>
                    <div>
                        <PageTitle>Оплата товару</PageTitle>

                        <PageDescription>
                            Демонстраційна імітація платежу. Реальні кошти не списуються.
                        </PageDescription>
                    </div>

                    <BackButton type="button" onClick={() => router.back()}>
                        Назад
                    </BackButton>
                </PageHeader>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <CheckoutGrid>
                    <FormCard>
                        <GooglePayBadge>
                            <span>G Pay</span>
                            <strong>Simulation</strong>
                        </GooglePayBadge>

                        <SecureBox>
                            <strong>Безпечна демонстраційна оплата</strong>
                            <p>
                                Backend створює платіж, перевіряє товар і суму, після чого
                                виконується імітація обробки платежу.
                            </p>
                        </SecureBox>

                        <Field>
                            <label htmlFor="cardNumber">Тестова картка</label>

                            <Input
                                id="cardNumber"
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value)}
                                placeholder="4242 4242 4242 4242"
                            />

                            <HelpText>
                                Успішна: 4242 4242 4242 4242 · Відхилена: 4000 0000 0000 0000 ·
                                3DS: 4111 1111 1111 1111
                            </HelpText>
                        </Field>

                        {requires3DS && (
                            <ThreeDSCard>
                                <Field>
                                    <label htmlFor="threeDSCode">3DS-код підтвердження</label>

                                    <Input
                                        id="threeDSCode"
                                        value={threeDSCode}
                                        onChange={e => setThreeDSCode(e.target.value)}
                                        placeholder="111111"
                                    />
                                </Field>

                                <ConfirmButton
                                    type="button"
                                    onClick={handleConfirm3DS}
                                    disabled={status === 'loading'}
                                >
                                    Підтвердити 3DS
                                </ConfirmButton>
                            </ThreeDSCard>
                        )}

                        {message && <StatusMessage $status={status}>{message}</StatusMessage>}

                        <Actions>
                            <BackButton type="button" onClick={() => router.back()}>
                                Скасувати
                            </BackButton>

                            <PayButton
                                type="button"
                                onClick={handleGooglePaySimulation}
                                disabled={status === 'loading' || !item}
                            >
                                {status === 'loading' ? 'Обробка...' : 'Оплатити'}
                            </PayButton>
                        </Actions>
                    </FormCard>

                    <OrderCard>
                        <SummaryTitle>Ваше замовлення</SummaryTitle>

                        <ImageBox>
                            {item?.img?.[0] ? (
                                <ItemImage src={`${IMAGE_URL}${item.img[0]}`} alt={item.name} />
                            ) : (
                                <span>Фото відсутнє</span>
                            )}
                        </ImageBox>

                        <ItemName>{item?.name || 'Товар не знайдено'}</ItemName>

                        <ItemMeta>
                            <span>Локація</span>
                            <strong>{item?.location || 'Не вказано'}</strong>
                        </ItemMeta>

                        <ItemMeta>
                            <span>Стан</span>
                            <strong>{item?.isNewState ? 'Новий' : 'Б/в'}</strong>
                        </ItemMeta>

                        <SummaryRow>
                            <span>Вартість товару</span>
                            <strong>{item ? formatPrice(item.price) : 0} грн</strong>
                        </SummaryRow>

                        <SummaryRow>
                            <span>Комісія сервісу</span>
                            <strong>0 грн</strong>
                        </SummaryRow>

                        <TotalRow>
                            <span>До оплати</span>
                            <Price>{item ? formatPrice(item.price) : 0} грн</Price>
                        </TotalRow>

                        <CardBrand>
                            <span>Demo payment provider</span>
                            <strong>Local Market Pay</strong>
                        </CardBrand>
                    </OrderCard>
                </CheckoutGrid>
            </PageContainer>
        </Page>
    );
}