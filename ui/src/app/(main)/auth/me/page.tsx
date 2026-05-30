'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import UserService, { AuthUser } from '@/services/UserService';
import ItemService from '@/services/ItemService';
import ChatService, { Chat } from '@/services/ChatService';
import PaymentService, {
    Checkout,
    Payment,
    PaymentItem,
} from '@/services/PaymentService';
import { Item } from '@/services/CategoryService';

import {
    Actions,
    DangerButton,
    EmptyState,
    Field,
    Grid,
    Header,
    InfoCard,
    ItemCard,
    List,
    Page,
    PageContainer,
    PrimaryButton,
    Section,
    SmallButton,
    StatCard,
    StatsGrid,
    TabButton,
    Tabs,
    ContentFade,
    SkeletonBlock,
    SkeletonGrid,
    SkeletonInfoItem,
    TextInput,
    TitleBlock,
    DangerSmallButton,
    ModalActions,
    ModalBackdrop,
    ModalCard,
    ModalError,
    ModalGrid,
    ModalHeader,
    ModalSelect,
    TextArea,
} from './styled';
import { getValidAuthToken, removeAuthToken } from '@/Utils/authToken';

type TabId = 'overview' | 'items' | 'chats' | 'transactions' | 'sales' | 'settings';

type ProfileForm = {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    avatar: string;
};

type UsernameForm = {
    username: string;
};

type PasswordForm = {
    currentPassword: string;
    newPassword: string;
    repeatPassword: string;
};

type ItemEditForm = {
    name: string;
    description: string;
    price: string;
    location: string;
    isNewState: boolean;
};

function getItemEditForm(item: Item): ItemEditForm {
    return {
        name: item.name || '',
        description: item.description || '',
        price: String(item.price || ''),
        location: item.location || '',
        isNewState: Boolean(item.isNewState),
    };
}

const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'overview', label: 'Огляд' },
    { id: 'items', label: 'Мої оголошення' },
    { id: 'chats', label: 'Чати' },
    { id: 'transactions', label: 'Транзакції' },
    { id: 'sales', label: 'Продаж' },
    { id: 'settings', label: 'Налаштування' },
];

function getToken() {
    return getValidAuthToken();
}

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || error?.message || fallback;
}

function getUserName(user?: AuthUser | null) {
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

    return fullName || user?.username || 'Користувач';
}

function getChatUserName(user?: {
    username?: string;
    firstName?: string;
    lastName?: string;
}) {
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

    return fullName || user?.username || 'Користувач';
}

function getCurrentUserId(token: string) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        return payload.id || '';
    } catch {
        return '';
    }
}

function formatPrice(value?: number) {
    return new Intl.NumberFormat('uk-UA').format(Number(value || 0));
}

function getPaymentCheckout(payment: Payment): Checkout | null {
    if (!payment.checkout || typeof payment.checkout === 'string') return null;

    return payment.checkout;
}

function getPaymentItem(payment: Payment): PaymentItem | null {
    if (payment.item && typeof payment.item !== 'string') return payment.item;

    const checkout = getPaymentCheckout(payment);

    if (checkout?.item && typeof checkout.item !== 'string') {
        return checkout.item;
    }

    return null;
}

function getCheckoutId(payment: Payment) {
    const checkout = getPaymentCheckout(payment);

    return checkout?._id || String(payment.checkout || '');
}

function getPaymentTotal(payment: Payment) {
    const checkout = getPaymentCheckout(payment);

    return checkout?.totalAmount ?? payment.amount;
}

function getPaymentCurrency(payment: Payment) {
    const checkout = getPaymentCheckout(payment);

    return checkout?.currency || payment.currency || 'UAH';
}

function getPaymentStatusLabel(payment: Payment) {
    if (payment.status === 'paid_test') return 'Оплачено';
    if (payment.status === 'processing') return 'Обробка';
    if (payment.status === 'requires_action') return 'Очікує 3DS';
    if (payment.status === 'failed') return 'Помилка';
    if (payment.status === 'cancelled') return 'Скасовано';

    return 'Очікує оплати';
}

function getPaymentUserName(user: Payment['buyer'] | Payment['seller']) {
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

function ProfileSkeleton() {
    return (
        <Page>
            <PageContainer>
                <ContentFade>
                    <Header>
                        <TitleBlock>
                            <SkeletonBlock $width="160px" $height="16px" />

                            <div style={{ marginTop: 10 }}>
                                <SkeletonBlock $width="340px" $height="54px" />
                            </div>

                            <div style={{ marginTop: 14 }}>
                                <SkeletonBlock $width="620px" $height="18px" />
                            </div>

                            <div style={{ marginTop: 8 }}>
                                <SkeletonBlock $width="480px" $height="18px" />
                            </div>
                        </TitleBlock>

                        <Actions>
                            <SkeletonBlock $width="160px" $height="42px" />
                            <SkeletonBlock $width="90px" $height="42px" />
                        </Actions>
                    </Header>

                    <Tabs>
                        {tabs.map((tab) => (
                            <SkeletonBlock
                                key={tab.id}
                                $width="130px"
                                $height="44px"
                                $radius="16px"
                            />
                        ))}
                    </Tabs>

                    <Section>
                        <StatsGrid>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <StatCard key={index}>
                                    <SkeletonBlock $width="110px" $height="14px" />
                                    <div style={{ marginTop: 12 }}>
                                        <SkeletonBlock $width="72px" $height="34px" />
                                    </div>
                                </StatCard>
                            ))}
                        </StatsGrid>

                        <InfoCard>
                            <SkeletonBlock $width="190px" $height="30px" />

                            <div style={{ marginTop: 16 }}>
                                <SkeletonGrid>
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <SkeletonInfoItem key={index}>
                                            <SkeletonBlock $width="90px" $height="14px" />
                                            <SkeletonBlock $width="70%" $height="18px" />
                                        </SkeletonInfoItem>
                                    ))}
                                </SkeletonGrid>
                            </div>
                        </InfoCard>
                    </Section>
                </ContentFade>
            </PageContainer>
        </Page>
    );
}

export default function ProfilePage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabId>('overview');

    const [user, setUser] = useState<AuthUser | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [purchasePayments, setPurchasePayments] = useState<Payment[]>([]);
    const [salesPayments, setSalesPayments] = useState<Payment[]>([]);

    const [profileForm, setProfileForm] = useState<ProfileForm>({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        city: '',
        avatar: '',
    });

    const [usernameForm, setUsernameForm] = useState<UsernameForm>({
        username: '',
    });

    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        repeatPassword: '',
    });

    const [deletePassword, setDeletePassword] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [itemEditForm, setItemEditForm] = useState<ItemEditForm | null>(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isItemActionLoading, setIsItemActionLoading] = useState(false);
    const [itemActionError, setItemActionError] = useState('');

    const token = useMemo(() => getToken(), []);
    const currentUserId = useMemo(() => getCurrentUserId(token), [token]);

    useEffect(() => {
        let isMounted = true;

        async function loadCabinet() {
            const actualToken = getValidAuthToken();

            if (!actualToken) {
                router.replace('/registration');
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                const userData = await UserService.me(actualToken);

                if (!isMounted) return;

                setUser(userData);

                setProfileForm({
                    email: userData.email || '',
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    phone: userData.phone || '',
                    city: userData.city || '',
                    avatar: userData.avatar || '',
                });

                setUsernameForm({
                    username: userData.username || '',
                });

                const [
                    itemsResult,
                    chatsResult,
                    purchasesResult,
                    salesResult,
                ] = await Promise.allSettled([
                    ItemService.getMyItems(actualToken),
                    ChatService.getMyChats(actualToken),
                    PaymentService.getMyPayments(actualToken),
                    PaymentService.getMySalesPayments(actualToken),
                ]);

                if (!isMounted) return;

                if (itemsResult.status === 'fulfilled') {
                    setItems(itemsResult.value.items || []);
                } else {
                    setItems([]);
                }

                if (chatsResult.status === 'fulfilled') {
                    setChats(chatsResult.value || []);
                } else {
                    setChats([]);
                }

                if (purchasesResult.status === 'fulfilled') {
                    setPurchasePayments(
                        (purchasesResult.value || []).filter((payment) => {
                            if (!currentUserId) return true;

                            if (typeof payment.buyer === 'string') {
                                return String(payment.buyer) === String(currentUserId);
                            }

                            return String(payment.buyer?._id) === String(currentUserId);
                        }),
                    );
                } else {
                    setPurchasePayments([]);
                }

                if (salesResult.status === 'fulfilled') {
                    setSalesPayments(
                        (salesResult.value || []).filter((payment) => {
                            if (!currentUserId) return true;

                            if (typeof payment.seller === 'string') {
                                return String(payment.seller) === String(currentUserId);
                            }

                            return String(payment.seller?._id) === String(currentUserId);
                        }),
                    );
                } else {
                    setSalesPayments([]);
                }
            } catch {
                removeAuthToken();
                router.replace('/registration');
                return;
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadCabinet();

        return () => {
            isMounted = false;
        };
    }, [router, currentUserId]);

    function logout() {
        removeAuthToken();
        router.push('/home');
    }

    async function handleProfileUpdate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setError('');
            setMessage('');

            const updatedUser = await UserService.updateMe(token, profileForm);

            setUser(updatedUser);
            setMessage('Профіль оновлено');
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося оновити профіль'));
        }
    }

    async function handleUsernameUpdate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setError('');
            setMessage('');

            const username = usernameForm.username.trim();

            if (username.length < 3) {
                setError('Логін має містити мінімум 3 символи');
                return;
            }

            const updatedUser = await UserService.updateUsername(token, {
                username,
            });

            setUser(updatedUser);
            setUsernameForm({
                username: updatedUser.username,
            });

            setMessage('Логін оновлено');
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося оновити логін'));
        }
    }

    async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setError('');
            setMessage('');

            if (passwordForm.newPassword.length < 6) {
                setError('Новий пароль має містити мінімум 6 символів');
                return;
            }

            if (passwordForm.newPassword !== passwordForm.repeatPassword) {
                setError('Новий пароль і повторення не збігаються');
                return;
            }

            await UserService.updatePassword(token, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });

            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                repeatPassword: '',
            });

            setMessage('Пароль оновлено');
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося оновити пароль'));
        }
    }

    async function handleDeleteAccount() {
        try {
            setError('');
            setMessage('');

            if (!deletePassword.trim()) {
                setError('Введіть пароль для підтвердження видалення акаунта');
                return;
            }

            const confirmed = window.confirm(
                'Ви точно хочете видалити акаунт? Цю дію не можна буде скасувати.',
            );

            if (!confirmed) return;

            await UserService.deleteMe(token, {
                currentPassword: deletePassword,
            });

            removeAuthToken();
            router.push('/home');
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося видалити акаунт'));
        }
    }

    function getCompanion(chat: Chat) {
        return String(chat.buyer?._id) === String(currentUserId)
            ? chat.seller
            : chat.buyer;
    }

    function openItemEditModal(item: Item) {
        setEditingItem(item);
        setItemEditForm(getItemEditForm(item));
        setItemActionError('');
        setIsItemModalOpen(true);
    }

    function closeItemEditModal() {
        if (isItemActionLoading) return;

        setEditingItem(null);
        setItemEditForm(null);
        setItemActionError('');
        setIsItemModalOpen(false);
    }

    function handleItemEditChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) {
        const { name, value } = event.target;

        setItemEditForm((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                [name]: name === 'isNewState' ? value === 'true' : value,
            };
        });
    }

    async function handleItemEditSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!editingItem || !itemEditForm) return;

        const actualToken = getValidAuthToken();

        if (!actualToken) {
            router.replace('/registration');
            return;
        }

        const price = Number(itemEditForm.price);

        if (!itemEditForm.name.trim()) {
            setItemActionError('Вкажіть назву оголошення');
            return;
        }

        if (!Number.isFinite(price) || price <= 0) {
            setItemActionError('Ціна має бути більшою за 0');
            return;
        }

        if (!itemEditForm.location.trim()) {
            setItemActionError('Вкажіть місто');
            return;
        }

        try {
            setIsItemActionLoading(true);
            setItemActionError('');

            const updatedItem = await ItemService.updateItem(actualToken, editingItem._id, {
                name: itemEditForm.name.trim(),
                description: itemEditForm.description.trim(),
                price,
                location: itemEditForm.location.trim(),
                isNewState: itemEditForm.isNewState,
            });

            setItems((prev) =>
                prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)),
            );

            setMessage('Оголошення оновлено');
            closeItemEditModal();
        } catch (e: any) {
            setItemActionError(e?.message || 'Не вдалося оновити оголошення');
        } finally {
            setIsItemActionLoading(false);
        }
    }

    async function handleItemDelete(item: Item) {
        const actualToken = getValidAuthToken();

        if (!actualToken) {
            router.replace('/registration');
            return;
        }

        const confirmed = window.confirm(`Видалити оголошення "${item.name}"?`);

        if (!confirmed) return;

        try {
            setIsItemActionLoading(true);
            setError('');
            setMessage('');

            await ItemService.deleteItem(actualToken, item._id);

            setItems((prev) => prev.filter((currentItem) => currentItem._id !== item._id));
            setMessage('Оголошення видалено');
        } catch (e: any) {
            setError(e?.message || 'Не вдалося видалити оголошення');
        } finally {
            setIsItemActionLoading(false);
        }
    }

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    return (
        <Page>
            <PageContainer>
                <ContentFade>
                    <Header>
                        <TitleBlock>
                            <span>Особистий кабінет</span>
                            <h1>{getUserName(user)}</h1>
                        </TitleBlock>

                        <Actions>
                            <SmallButton type="button" onClick={() => router.push('/ad')}>
                                Створити оголошення
                            </SmallButton>

                            <DangerButton type="button" onClick={logout}>
                                Вийти
                            </DangerButton>
                        </Actions>
                    </Header>

                    <Tabs>
                        {tabs.map((tab) => (
                            <TabButton
                                key={tab.id}
                                type="button"
                                $active={activeTab === tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setError('');
                                    setMessage('');
                                }}
                            >
                                {tab.label}
                            </TabButton>
                        ))}
                    </Tabs>

                    {error && <EmptyState $danger>{error}</EmptyState>}
                    {message && <EmptyState $success>{message}</EmptyState>}

                    {activeTab === 'overview' && (
                        <Section>
                            <StatsGrid>
                                <StatCard>
                                    <span>Оголошення</span>
                                    <strong>{items.length}</strong>
                                </StatCard>

                                <StatCard>
                                    <span>Чати</span>
                                    <strong>{chats.length}</strong>
                                </StatCard>

                                <StatCard>
                                    <span>Покупки</span>
                                    <strong>{purchasePayments.length}</strong>
                                </StatCard>

                                <StatCard>
                                    <span>Продажі</span>
                                    <strong>{salesPayments.length}</strong>
                                </StatCard>
                            </StatsGrid>

                            <InfoCard>
                                <h2>Дані профілю</h2>

                                <Grid>
                                    <p>
                                        <span>Логін</span>
                                        <strong>{user?.username}</strong>
                                    </p>

                                    <p>
                                        <span>Email</span>
                                        <strong>{user?.email || 'Не вказано'}</strong>
                                    </p>

                                    <p>
                                        <span>Телефон</span>
                                        <strong>{user?.phone || 'Не вказано'}</strong>
                                    </p>

                                    <p>
                                        <span>Місто</span>
                                        <strong>{user?.city || 'Не вказано'}</strong>
                                    </p>
                                </Grid>
                            </InfoCard>
                        </Section>
                    )}

                    {activeTab === 'items' && (
                        <Section>
                            <InfoCard>
                                <h2>Мої оголошення</h2>

                                {items.length === 0 ? (
                                    <EmptyState>
                                        У вас ще немає створених оголошень.
                                    </EmptyState>
                                ) : (
                                    <List>
                                        {items.map((item) => (
                                            <ItemCard key={item._id}>
                                                <div>
                                                    <strong>{item.name}</strong>
                                                    <span>
                                                        {item.price} грн · {item.location}
                                                    </span>
                                                </div>

                                                <Actions>
                                                    <SmallButton
                                                        type="button"
                                                        onClick={() => router.push(`/obyava/${item._id}`)}
                                                    >
                                                        Переглянути
                                                    </SmallButton>

                                                    <SmallButton
                                                        type="button"
                                                        onClick={() => openItemEditModal(item)}
                                                    >
                                                        Редагувати
                                                    </SmallButton>

                                                    <DangerSmallButton
                                                        type="button"
                                                        disabled={isItemActionLoading}
                                                        onClick={() => handleItemDelete(item)}
                                                    >
                                                        Видалити
                                                    </DangerSmallButton>
                                                </Actions>
                                            </ItemCard>
                                        ))}
                                    </List>
                                )}
                            </InfoCard>
                        </Section>
                    )}

                    {activeTab === 'chats' && (
                        <Section>
                            <InfoCard>
                                <h2>Мої чати</h2>

                                {chats.length === 0 ? (
                                    <EmptyState>У вас поки немає чатів.</EmptyState>
                                ) : (
                                    <List>
                                        {chats.map((chat) => {
                                            const companion = getCompanion(chat);

                                            return (
                                                <ItemCard key={chat._id}>
                                                    <div>
                                                        <strong>{getChatUserName(companion)}</strong>
                                                        <span>
                                                            {chat.item?.name || 'Оголошення'} ·{' '}
                                                            {chat.lastMessageText || 'Повідомлень ще немає'}
                                                        </span>
                                                    </div>

                                                    <Actions>
                                                        <SmallButton
                                                            type="button"
                                                            onClick={() => router.push(`/chats/${chat._id}`)}
                                                        >
                                                            Відкрити чат
                                                        </SmallButton>
                                                    </Actions>
                                                </ItemCard>
                                            );
                                        })}
                                    </List>
                                )}
                            </InfoCard>
                        </Section>
                    )}

                    {activeTab === 'transactions' && (
                        <Section>
                            <InfoCard>
                                <h2>Мої покупки</h2>

                                {purchasePayments.length === 0 ? (
                                    <EmptyState>
                                        У вас ще немає транзакцій, де ви покупець.
                                    </EmptyState>
                                ) : (
                                    <List>
                                        {purchasePayments.map((payment) => {
                                            const item = getPaymentItem(payment);
                                            const checkoutId = getCheckoutId(payment);

                                            return (
                                                <ItemCard key={payment._id}>
                                                    <div>
                                                        <strong>{item?.name || 'Оголошення'}</strong>
                                                        <span>
                                                            {formatPrice(getPaymentTotal(payment))}{' '}
                                                            {getPaymentCurrency(payment)} ·{' '}
                                                            {getPaymentStatusLabel(payment)}
                                                        </span>
                                                    </div>

                                                    <Actions>
                                                        {checkoutId && (
                                                            <SmallButton
                                                                type="button"
                                                                onClick={() => router.push(`/checkout-details/${checkoutId}`)}
                                                            >
                                                                Деталі
                                                            </SmallButton>
                                                        )}
                                                    </Actions>
                                                </ItemCard>
                                            );
                                        })}
                                    </List>
                                )}
                            </InfoCard>
                        </Section>
                    )}

                    {activeTab === 'sales' && (
                        <Section>
                            <InfoCard>
                                <h2>Продаж</h2>

                                {salesPayments.length === 0 ? (
                                    <EmptyState>
                                        Поки немає checkout-ів, де ви продавець.
                                    </EmptyState>
                                ) : (
                                    <List>
                                        {salesPayments.map((payment) => {
                                            const item = getPaymentItem(payment);
                                            const checkout = getPaymentCheckout(payment);
                                            const checkoutId = getCheckoutId(payment);

                                            return (
                                                <ItemCard key={payment._id}>
                                                    <div>
                                                        <strong>{item?.name || 'Оголошення'}</strong>
                                                        <span>
                                                            Покупець: {getPaymentUserName(payment.buyer)} ·{' '}
                                                            {formatPrice(getPaymentTotal(payment))}{' '}
                                                            {getPaymentCurrency(payment)} ·{' '}
                                                            {getPaymentStatusLabel(payment)}
                                                        </span>

                                                        {checkout?.delivery && (
                                                            <span>
                                                                Доставка: {getDeliveryLabel(checkout.delivery.type)} ·{' '}
                                                                {checkout.delivery.city || 'місто не вказано'} ·{' '}
                                                                {checkout.delivery.receiverName || 'отримувача не вказано'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Actions>
                                                        {checkoutId && (
                                                            <SmallButton
                                                                type="button"
                                                                onClick={() => router.push(`/checkout-details/${checkoutId}`)}
                                                            >
                                                                Деталі
                                                            </SmallButton>
                                                        )}
                                                    </Actions>
                                                </ItemCard>
                                            );
                                        })}
                                    </List>
                                )}
                            </InfoCard>
                        </Section>
                    )}

                    {activeTab === 'settings' && (
                        <Section>
                            <InfoCard>
                                <h2>Редагування профілю</h2>

                                <form onSubmit={handleProfileUpdate}>
                                    <Grid>
                                        <Field>
                                            <label>Email</label>
                                            <TextInput
                                                value={profileForm.email}
                                                onChange={(event) =>
                                                    setProfileForm((prev) => ({
                                                        ...prev,
                                                        email: event.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>

                                        <Field>
                                            <label>Ім’я</label>
                                            <TextInput
                                                value={profileForm.firstName}
                                                onChange={(event) =>
                                                    setProfileForm((prev) => ({
                                                        ...prev,
                                                        firstName: event.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>

                                        <Field>
                                            <label>Прізвище</label>
                                            <TextInput
                                                value={profileForm.lastName}
                                                onChange={(event) =>
                                                    setProfileForm((prev) => ({
                                                        ...prev,
                                                        lastName: event.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>

                                        <Field>
                                            <label>Телефон</label>
                                            <TextInput
                                                value={profileForm.phone}
                                                onChange={(event) =>
                                                    setProfileForm((prev) => ({
                                                        ...prev,
                                                        phone: event.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>

                                        <Field>
                                            <label>Місто</label>
                                            <TextInput
                                                value={profileForm.city}
                                                onChange={(event) =>
                                                    setProfileForm((prev) => ({
                                                        ...prev,
                                                        city: event.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>

                                        <Field>
                                            <label>Аватар URL</label>
                                            <TextInput
                                                value={profileForm.avatar}
                                                onChange={(event) =>
                                                    setProfileForm((prev) => ({
                                                        ...prev,
                                                        avatar: event.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>
                                    </Grid>

                                    <PrimaryButton type="submit">
                                        Зберегти профіль
                                    </PrimaryButton>
                                </form>
                            </InfoCard>

                            <InfoCard>
                                <h2>Зміна логіна</h2>

                                <form onSubmit={handleUsernameUpdate}>
                                    <Field>
                                        <label>Новий логін</label>
                                        <TextInput
                                            value={usernameForm.username}
                                            onChange={(event) =>
                                                setUsernameForm({
                                                    username: event.target.value,
                                                })
                                            }
                                        />
                                    </Field>

                                    <PrimaryButton type="submit">
                                        Оновити логін
                                    </PrimaryButton>
                                </form>
                            </InfoCard>

                            <InfoCard>
                                <h2>Зміна пароля</h2>

                                <form onSubmit={handlePasswordUpdate}>
                                    <Grid>
                                        <Field>
                                            <label>Поточний пароль</label>
                                            <TextInput
                                                type="password"
                                                value={passwordForm.currentPassword}
                                                onChange={(event) =>
                                                    setPasswordForm((prev) => ({
                                                        ...prev,
                                                        currentPassword: event.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>

                                        <Field>
                                            <label>Новий пароль</label>
                                            <TextInput
                                                type="password"
                                                value={passwordForm.newPassword}
                                                onChange={(event) =>
                                                    setPasswordForm((prev) => ({
                                                        ...prev,
                                                        newPassword: event.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>

                                        <Field>
                                            <label>Повторіть новий пароль</label>
                                            <TextInput
                                                type="password"
                                                value={passwordForm.repeatPassword}
                                                onChange={(event) =>
                                                    setPasswordForm((prev) => ({
                                                        ...prev,
                                                        repeatPassword: event.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>
                                    </Grid>

                                    <PrimaryButton type="submit">
                                        Оновити пароль
                                    </PrimaryButton>
                                </form>
                            </InfoCard>

                            <InfoCard $danger>
                                <h2>Видалення акаунта</h2>

                                <Field>
                                    <label>Пароль для підтвердження</label>
                                    <TextInput
                                        type="password"
                                        value={deletePassword}
                                        onChange={(event) => setDeletePassword(event.target.value)}
                                    />
                                </Field>

                                <DangerButton type="button" onClick={handleDeleteAccount}>
                                    Видалити акаунт
                                </DangerButton>
                            </InfoCard>
                        </Section>
                    )}
                </ContentFade>
            </PageContainer>
            {isItemModalOpen && editingItem && itemEditForm && (
                <ModalBackdrop>
                    <ModalCard>
                        <ModalHeader>
                            <div>
                                <h2>Редагувати оголошення</h2>
                                <p>{editingItem.name}</p>
                            </div>

                            <SmallButton type="button" onClick={closeItemEditModal}>
                                Закрити
                            </SmallButton>
                        </ModalHeader>

                        <form onSubmit={handleItemEditSubmit}>
                            <ModalGrid>
                                <Field>
                                    <label>Назва</label>
                                    <TextInput
                                        name="name"
                                        value={itemEditForm.name}
                                        onChange={handleItemEditChange}
                                    />
                                </Field>

                                <Field>
                                    <label>Ціна, грн</label>
                                    <TextInput
                                        name="price"
                                        type="number"
                                        min="1"
                                        value={itemEditForm.price}
                                        onChange={handleItemEditChange}
                                    />
                                </Field>

                                <Field>
                                    <label>Місто</label>
                                    <TextInput
                                        name="location"
                                        value={itemEditForm.location}
                                        onChange={handleItemEditChange}
                                    />
                                </Field>

                                <Field>
                                    <label>Стан</label>
                                    <ModalSelect
                                        name="isNewState"
                                        value={String(itemEditForm.isNewState)}
                                        onChange={handleItemEditChange}
                                    >
                                        <option value="false">Б/в</option>
                                        <option value="true">Новий</option>
                                    </ModalSelect>
                                </Field>
                            </ModalGrid>

                            <Field>
                                <label>Опис</label>
                                <TextArea
                                    name="description"
                                    value={itemEditForm.description}
                                    onChange={handleItemEditChange}
                                />
                            </Field>

                            {itemActionError && <ModalError>{itemActionError}</ModalError>}

                            <ModalActions>
                                <SmallButton type="button" onClick={closeItemEditModal}>
                                    Скасувати
                                </SmallButton>

                                <PrimaryButton type="submit" disabled={isItemActionLoading}>
                                    {isItemActionLoading ? 'Збереження...' : 'Зберегти'}
                                </PrimaryButton>
                            </ModalActions>
                        </form>
                    </ModalCard>
                </ModalBackdrop>
            )}
        </Page>
    );
}