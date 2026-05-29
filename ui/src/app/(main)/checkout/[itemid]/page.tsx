'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { CategoryService, Item } from '@/services/CategoryService';
import PaymentService, {
    DeliveryType,
    PaymentMethod,
} from '@/services/PaymentService';
import { getAuthToken } from '@/Utils/authToken';

import {
    BackButton,
    CheckoutCard,
    CheckoutGrid,
    DeliveryGrid,
    ErrorMessage,
    Field,
    ItemImage,
    ItemPreview,
    LoadingCard,
    MethodCard,
    MethodGrid,
    Page,
    PageContainer,
    PageDescription,
    PageHeader,
    PageTitle,
    PrimaryButton,
    RadioCard,
    SummaryCard,
    SummaryLine,
    TextArea,
    TextInput,
} from './styled';

const IMAGE_URL = 'http://localhost:3005/img/';

type CheckoutForm = {
    receiverName: string;
    buyerPhone: string;
    deliveryCity: string;
    deliveryAddress: string;
    buyerComment: string;
    deliveryType: DeliveryType;
    method: PaymentMethod;
};

const initialForm: CheckoutForm = {
    receiverName: '',
    buyerPhone: '',
    deliveryCity: '',
    deliveryAddress: '',
    buyerComment: '',
    deliveryType: 'agreement',
    method: 'google_pay_simulation',
};

function formatPrice(value: number) {
    return new Intl.NumberFormat('uk-UA').format(value);
}

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || error?.message || fallback;
}

function getSellerName(item: Item | null) {
    const owner = (item as any)?.owner;

    if (!owner || typeof owner === 'string') {
        return 'Продавець';
    }

    const fullName = `${owner.firstName || ''} ${owner.lastName || ''}`.trim();

    return fullName || owner.username || 'Продавець';
}

export default function CheckoutPage() {
    const router = useRouter();
    const params = useParams<{ itemid: string }>();

    const [item, setItem] = useState<Item | null>(null);
    const [form, setForm] = useState<CheckoutForm>(initialForm);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const firstImage = useMemo(() => {
        return item?.img?.[0] || '';
    }, [item]);

    const amount = Number(item?.price || 0);
    const serviceFee = 0;
    const totalAmount = amount + serviceFee;

    useEffect(() => {
        async function loadItem() {
            const token = getAuthToken();

            if (!token) {
                router.replace('/registration');
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                const itemData = await CategoryService.getItemById(params.itemid);
                console.log(itemData);
                setItem(itemData);
            } catch (e: any) {
                setError(getErrorMessage(e, 'Не вдалося завантажити товар'));
            } finally {
                setIsLoading(false);
            }
        }

        console.log(params)
        if (params.itemid) {
            loadItem();
        }
    }, [params.itemid, router]);

    function handleChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function validateForm() {
        if (!form.receiverName.trim()) {
            return 'Вкажіть ім’я отримувача';
        }

        if (!form.buyerPhone.trim()) {
            return 'Вкажіть номер телефону';
        }

        if (form.deliveryType === 'delivery' && !form.deliveryCity.trim()) {
            return 'Вкажіть місто доставки';
        }

        if (form.deliveryType === 'delivery' && !form.deliveryAddress.trim()) {
            return 'Вкажіть адресу або відділення доставки';
        }

        return '';
    }

    async function handleSubmit() {
        const token = getAuthToken();

        if (!token) {
            router.replace('/registration');
            return;
        }

        if (!item) return;

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const payment = await PaymentService.createCheckout(token, {
                itemId: item._id,
                method: form.method,
                deliveryType: form.deliveryType,
                deliveryCity: form.deliveryCity.trim(),
                deliveryAddress: form.deliveryAddress.trim(),
                receiverName: form.receiverName.trim(),
                buyerPhone: form.buyerPhone.trim(),
                buyerComment: form.buyerComment.trim(),
            });

            router.push(`/payment/${payment._id}`);
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося створити checkout'));
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <Page>
                <PageContainer>
                    <LoadingCard>Завантаження checkout...</LoadingCard>
                </PageContainer>
            </Page>
        );
    }

    if (error && !item) {
        return (
            <Page>
                <PageContainer>
                    <LoadingCard>{error}</LoadingCard>
                </PageContainer>
            </Page>
        );
    }

    if (!item) return null;

    return (
        <Page>
            <PageContainer>
                <PageHeader>
                    <div>
                        <PageTitle>Оформлення покупки</PageTitle>
                        <PageDescription>
                            Перевірте товар, виберіть доставку та спосіб оплати.
                            Сам платіж буде виконано на наступній сторінці.
                        </PageDescription>
                    </div>

                    <BackButton type="button" onClick={() => router.back()}>
                        Назад
                    </BackButton>
                </PageHeader>

                <CheckoutGrid>
                    <CheckoutCard>
                        <ItemPreview>
                            {firstImage ? (
                                <ItemImage
                                    src={`${IMAGE_URL}${firstImage}`}
                                    alt={item.name}
                                />
                            ) : (
                                <ItemImage as="div">Фото немає</ItemImage>
                            )}

                            <div>
                                <span>Товар</span>
                                <strong>{item.name}</strong>
                                <p>{formatPrice(amount)} грн</p>
                            </div>
                        </ItemPreview>

                        <Field>
                            <label>Тип доставки</label>

                            <DeliveryGrid>
                                <RadioCard
                                    type="button"
                                    $active={form.deliveryType === 'pickup'}
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            deliveryType: 'pickup',
                                        }))
                                    }
                                >
                                    <strong>Самовивіз</strong>
                                    <span>Домовитесь із продавцем</span>
                                </RadioCard>

                                <RadioCard
                                    type="button"
                                    $active={form.deliveryType === 'delivery'}
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            deliveryType: 'delivery',
                                        }))
                                    }
                                >
                                    <strong>Доставка</strong>
                                    <span>Місто та відділення</span>
                                </RadioCard>

                                <RadioCard
                                    type="button"
                                    $active={form.deliveryType === 'agreement'}
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            deliveryType: 'agreement',
                                        }))
                                    }
                                >
                                    <strong>За домовленістю</strong>
                                    <span>Уточните в чаті</span>
                                </RadioCard>
                            </DeliveryGrid>
                        </Field>

                        <Field>
                            <label htmlFor="receiverName">Ім’я отримувача</label>
                            <TextInput
                                id="receiverName"
                                name="receiverName"
                                value={form.receiverName}
                                onChange={handleChange}
                                placeholder="Наприклад: Юрій Ленчук"
                            />
                        </Field>

                        <Field>
                            <label htmlFor="buyerPhone">Телефон</label>
                            <TextInput
                                id="buyerPhone"
                                name="buyerPhone"
                                value={form.buyerPhone}
                                onChange={handleChange}
                                placeholder="+380..."
                            />
                        </Field>

                        <Field>
                            <label htmlFor="deliveryCity">Місто</label>
                            <TextInput
                                id="deliveryCity"
                                name="deliveryCity"
                                value={form.deliveryCity}
                                onChange={handleChange}
                                placeholder="Чернівці"
                            />
                        </Field>

                        <Field>
                            <label htmlFor="deliveryAddress">
                                Адреса / відділення
                            </label>
                            <TextInput
                                id="deliveryAddress"
                                name="deliveryAddress"
                                value={form.deliveryAddress}
                                onChange={handleChange}
                                placeholder="Наприклад: Нова пошта №1"
                            />
                        </Field>

                        <Field>
                            <label htmlFor="buyerComment">Коментар</label>
                            <TextArea
                                id="buyerComment"
                                name="buyerComment"
                                value={form.buyerComment}
                                onChange={handleChange}
                                placeholder="Побажання щодо доставки або часу зв’язку..."
                            />
                        </Field>

                        <Field>
                            <label>Спосіб оплати</label>

                            <MethodGrid>
                                <MethodCard
                                    type="button"
                                    $active={form.method === 'google_pay_simulation'}
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            method: 'google_pay_simulation',
                                        }))
                                    }
                                >
                                    <strong>Google Pay</strong>
                                    <span>Тестова імітація через API</span>
                                </MethodCard>

                                <MethodCard
                                    type="button"
                                    $active={form.method === 'card_simulation'}
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            method: 'card_simulation',
                                        }))
                                    }
                                >
                                    <strong>Картка</strong>
                                    <span>Імітація банківської оплати</span>
                                </MethodCard>

                                <MethodCard
                                    type="button"
                                    $active={form.method === 'cash_on_delivery'}
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            method: 'cash_on_delivery',
                                        }))
                                    }
                                >
                                    <strong>При отриманні</strong>
                                    <span>Без онлайн-оплати</span>
                                </MethodCard>
                            </MethodGrid>
                        </Field>

                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        <PrimaryButton
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Створення замовлення...'
                                : 'Перейти до оплати'}
                        </PrimaryButton>
                    </CheckoutCard>

                    <SummaryCard>
                        <h2>Підсумок</h2>

                        <SummaryLine>
                            <span>Товар</span>
                            <strong>{formatPrice(amount)} грн</strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Комісія сервісу</span>
                            <strong>{formatPrice(serviceFee)} грн</strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Продавець</span>
                            <strong>{getSellerName(item)}</strong>
                        </SummaryLine>

                        <SummaryLine>
                            <span>Локація</span>
                            <strong>{item.location || 'Не вказано'}</strong>
                        </SummaryLine>

                        <SummaryLine $total>
                            <span>До оплати</span>
                            <strong>{formatPrice(totalAmount)} грн</strong>
                        </SummaryLine>
                    </SummaryCard>
                </CheckoutGrid>
            </PageContainer>
        </Page>
    );
}