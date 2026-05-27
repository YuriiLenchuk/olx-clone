'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import UserService, { AuthUser } from '@/services/UserService';
import ItemService from '@/services/ItemService';
import ChatService, { Chat } from '@/services/ChatService';
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
    TextArea,
    TextInput,
    TitleBlock,
} from './styled';

type TabId = 'overview' | 'items' | 'chats' | 'transactions' | 'settings';

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

const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'overview', label: 'Огляд' },
    { id: 'items', label: 'Мої оголошення' },
    { id: 'chats', label: 'Чати' },
    { id: 'transactions', label: 'Транзакції' },
    { id: 'settings', label: 'Налаштування' },
];

function getToken() {
    return Cookies.get('authToken') || '';
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

export default function ProfilePage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabId>('overview');

    const [user, setUser] = useState<AuthUser | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);

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

    const token = useMemo(() => getToken(), []);
    const currentUserId = useMemo(() => getCurrentUserId(token), [token]);

    useEffect(() => {
        async function loadCabinet() {
            try {
                if (!token) {
                    router.push('/registration');
                    return;
                }

                setIsLoading(true);
                setError('');

                const [userData, itemsData, chatsData] = await Promise.all([
                    UserService.me(token),
                    ItemService.getMyItems(token),
                    ChatService.getMyChats(token),
                ]);

                setUser(userData);
                setItems(itemsData.items || []);
                setChats(chatsData || []);

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
            } catch (e: any) {
                setError(getErrorMessage(e, 'Не вдалося завантажити профіль'));
            } finally {
                setIsLoading(false);
            }
        }

        loadCabinet();
    }, [router, token]);

    function logout() {
        Cookies.remove('authToken');
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

            Cookies.remove('authToken');
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

    if (isLoading) {
        return (
            <Page>
                <PageContainer>
                    <EmptyState>Завантаження профілю...</EmptyState>
                </PageContainer>
            </Page>
        );
    }

    return (
        <Page>
            <PageContainer>
                <Header>
                    <TitleBlock>
                        <span>Особистий кабінет</span>
                        <h1>{getUserName(user)}</h1>
                        <p>
                            Керуйте профілем, оголошеннями, чатами, транзакціями та
                            налаштуваннями акаунта.
                        </p>
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
                                <span>Середня оцінка</span>
                                <strong>{Number(user?.averageRating || 0).toFixed(1)}</strong>
                            </StatCard>

                            <StatCard>
                                <span>Коментарі</span>
                                <strong>{user?.reviewsCount || 0}</strong>
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
                                <EmptyState>У вас ще немає створених оголошень.</EmptyState>
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
                            <h2>Транзакції</h2>

                            <EmptyState>
                                Транзакції будуть доступні після підключення сторінки оплати,
                                замовлень і Google Pay.
                            </EmptyState>
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

                                <PrimaryButton type="submit">Зберегти профіль</PrimaryButton>
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

                                <PrimaryButton type="submit">Оновити логін</PrimaryButton>
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

                                <PrimaryButton type="submit">Оновити пароль</PrimaryButton>
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
            </PageContainer>
        </Page>
    );
}