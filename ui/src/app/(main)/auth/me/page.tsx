'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import UserService, { AuthUser, UpdateUserPayload } from '@/services/UserService';
import ReviewService, { Review } from '@/services/ReviewService';

import {
    ActionButton,
    Avatar,
    EmptyState,
    FormActions,
    FormGrid,
    FormInput,
    InfoGrid,
    InfoItem,
    LoadingCard,
    LogoutButton,
    Page,
    PageContainer,
    ProfileCard,
    ProfileHeader,
    ProfileMeta,
    ProfileName,
    ProfileSection,
    RatingBox,
    ReviewCard,
    ReviewsList,
    SaveButton,
    SectionHeader,
    SectionTitle,
    SecondaryButton,
} from './styled';

function getToken() {
    return Cookies.get('authToken') || '';
}

function getUserId(user: AuthUser) {
    return user.id || user._id || '';
}

function getUserName(user: AuthUser) {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    return fullName || user.username || 'Користувач';
}

function getInitial(user: AuthUser) {
    return getUserName(user).charAt(0).toUpperCase();
}

function getReviewAuthorName(review: Review) {
    if (!review.author) return 'Користувач';

    const fullName = `${review.author.firstName || ''} ${review.author.lastName || ''}`.trim();

    return fullName || review.author.username || 'Користувач';
}

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || error?.message || fallback;
}

export default function MePage() {
    const router = useRouter();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);

    const [form, setForm] = useState<UpdateUserPayload>({});

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [error, setError] = useState('');
    const [reviewsError, setReviewsError] = useState('');

    async function loadReviews(userId: string) {
        try {
            setIsReviewsLoading(true);
            setReviewsError('');

            const reviewsData = await ReviewService.getUserReviews(userId, 1, 10);

            setReviews(reviewsData.reviews || []);
        } catch (e: any) {
            setReviewsError(
                getErrorMessage(e, 'Не вдалося завантажити коментарі користувача'),
            );
        } finally {
            setIsReviewsLoading(false);
        }
    }

    useEffect(() => {
        async function loadUser() {
            try {
                setIsLoading(true);
                setError('');

                const token = getToken();

                if (!token) {
                    setError('Ви ще не увійшли в профіль');
                    return;
                }

                const userData = await UserService.me(token);

                setUser(userData);
                setForm({
                    email: userData.email || '',
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    phone: userData.phone || '',
                    city: userData.city || '',
                    avatar: userData.avatar || '',
                });

                const userId = getUserId(userData);

                if (userId) {
                    await loadReviews(userId);
                }
            } catch (e: any) {
                setError(getErrorMessage(e, 'Не вдалося завантажити профіль'));
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, []);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function cancelEditing() {
        if (!user) return;

        setForm({
            email: user.email || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            city: user.city || '',
            avatar: user.avatar || '',
        });

        setIsEditing(false);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setIsSaving(true);
            setError('');

            const token = getToken();

            if (!token) {
                setError('Ви ще не увійшли в профіль');
                return;
            }

            const updatedUser = await UserService.updateMe(token, form);

            setUser(updatedUser);
            setForm({
                email: updatedUser.email || '',
                firstName: updatedUser.firstName || '',
                lastName: updatedUser.lastName || '',
                phone: updatedUser.phone || '',
                city: updatedUser.city || '',
                avatar: updatedUser.avatar || '',
            });

            setIsEditing(false);
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося оновити профіль'));
        } finally {
            setIsSaving(false);
        }
    }

    function logout() {
        Cookies.remove('authToken');
        router.push('/registration');
    }

    if (isLoading) {
        return (
            <Page>
                <PageContainer>
                    <LoadingCard>Завантаження профілю...</LoadingCard>
                </PageContainer>
            </Page>
        );
    }

    if (error || !user) {
        return (
            <Page>
                <PageContainer>
                    <EmptyState>
                        <h1>Профіль недоступний</h1>
                        <p>{error || 'Потрібно увійти в акаунт, щоб переглянути профіль.'}</p>
                        <Link href="/registration">Увійти або зареєструватися</Link>
                    </EmptyState>
                </PageContainer>
            </Page>
        );
    }

    return (
        <Page>
            <PageContainer>
                <ProfileCard>
                    <ProfileHeader>
                        <Avatar>{getInitial(user)}</Avatar>

                        <ProfileMeta>
                            <span>Мій профіль</span>
                            <ProfileName>{getUserName(user)}</ProfileName>
                            <p>@{user.username}</p>
                        </ProfileMeta>

                        <LogoutButton type="button" onClick={logout}>
                            Вийти
                        </LogoutButton>
                    </ProfileHeader>

                    <ProfileSection>
                        <SectionHeader>
                            <SectionTitle>Контактна інформація</SectionTitle>

                            {isEditing ? (
                                <SecondaryButton type="button" onClick={cancelEditing}>
                                    Скасувати
                                </SecondaryButton>
                            ) : (
                                <SecondaryButton type="button" onClick={() => setIsEditing(true)}>
                                    Редагувати
                                </SecondaryButton>
                            )}
                        </SectionHeader>

                        {isEditing ? (
                            <form onSubmit={handleSubmit}>
                                <FormGrid>
                                    <FormInput>
                                        <label>Імʼя</label>
                                        <input
                                            name="firstName"
                                            value={form.firstName || ''}
                                            onChange={handleChange}
                                            placeholder="Наприклад: Юрій"
                                        />
                                    </FormInput>

                                    <FormInput>
                                        <label>Прізвище</label>
                                        <input
                                            name="lastName"
                                            value={form.lastName || ''}
                                            onChange={handleChange}
                                            placeholder="Наприклад: Ленчук"
                                        />
                                    </FormInput>

                                    <FormInput>
                                        <label>Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email || ''}
                                            onChange={handleChange}
                                            placeholder="example@gmail.com"
                                        />
                                    </FormInput>

                                    <FormInput>
                                        <label>Телефон</label>
                                        <input
                                            name="phone"
                                            value={form.phone || ''}
                                            onChange={handleChange}
                                            placeholder="+380..."
                                        />
                                    </FormInput>

                                    <FormInput>
                                        <label>Місто</label>
                                        <input
                                            name="city"
                                            value={form.city || ''}
                                            onChange={handleChange}
                                            placeholder="Чернівці"
                                        />
                                    </FormInput>

                                    <FormInput>
                                        <label>Аватар / URL</label>
                                        <input
                                            name="avatar"
                                            value={form.avatar || ''}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                        />
                                    </FormInput>
                                </FormGrid>

                                <FormActions>
                                    <SaveButton type="submit" disabled={isSaving}>
                                        {isSaving ? 'Збереження...' : 'Зберегти зміни'}
                                    </SaveButton>
                                </FormActions>
                            </form>
                        ) : (
                            <InfoGrid>
                                <InfoItem>
                                    <span>Email</span>
                                    <strong>{user.email || 'Не вказано'}</strong>
                                </InfoItem>

                                <InfoItem>
                                    <span>Телефон</span>
                                    <strong>{user.phone || 'Не вказано'}</strong>
                                </InfoItem>

                                <InfoItem>
                                    <span>Місто</span>
                                    <strong>{user.city || 'Не вказано'}</strong>
                                </InfoItem>

                                <InfoItem>
                                    <span>Дата створення</span>
                                    <strong>
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString('uk-UA')
                                            : 'Не вказано'}
                                    </strong>
                                </InfoItem>
                            </InfoGrid>
                        )}
                    </ProfileSection>

                    <ProfileSection>
                        <SectionHeader>
                            <SectionTitle>Рейтинг продавця</SectionTitle>
                        </SectionHeader>


                        <RatingBox>
                            <strong>{Number(user.averageRating || 0).toFixed(1)}</strong>
                            <span>середня оцінка</span>
                            <p>
                                {user.reviewsCount || 0}{' '}
                                {(user.reviewsCount || 0) === 1 ? 'коментар' : 'коментарів'}
                            </p>
                        </RatingBox>
                    </ProfileSection>

                    <ProfileSection>
                        <SectionHeader>
                            <SectionTitle>Коментарі покупців</SectionTitle>

                            <SecondaryButton
                                type="button"
                                onClick={() => {
                                    const userId = getUserId(user);

                                    if (userId) {
                                        loadReviews(userId);
                                    }
                                }}
                            >
                                Оновити
                            </SecondaryButton>
                        </SectionHeader>

                        {isReviewsLoading && (
                            <LoadingCard>Завантаження коментарів...</LoadingCard>
                        )}

                        {!isReviewsLoading && reviewsError && (
                            <RatingBox>
                                <strong>!</strong>
                                <span>Помилка</span>
                                <p>{reviewsError}</p>
                            </RatingBox>
                        )}

                        {!isReviewsLoading && !reviewsError && reviews.length > 0 && (
                            <ReviewsList>
                                {reviews.map((review) => (
                                    <ReviewCard key={review._id}>
                                        <div>
                                            <strong>{getReviewAuthorName(review)}</strong>
                                            <span>{Number(review.rating).toFixed(1)} / 5</span>
                                        </div>

                                        <p>{review.comment || 'Без коментаря'}</p>

                                        {review.item && (
                                            <small>
                                                Оголошення: <b>{review.item.name}</b>
                                            </small>
                                        )}

                                        <time>
                                            {review.createdAt
                                                ? new Date(review.createdAt).toLocaleDateString('uk-UA')
                                                : ''}
                                        </time>
                                    </ReviewCard>
                                ))}
                            </ReviewsList>
                        )}

                        {!isReviewsLoading && !reviewsError && reviews.length === 0 && (
                            <RatingBox>
                                <strong>—</strong>
                                <span>Коментарів ще немає</span>
                                <p>Після перших угод тут будуть відгуки покупців.</p>
                            </RatingBox>
                        )}
                    </ProfileSection>

                    <ActionButton type="button" onClick={() => router.push('/wish-list')}>
                        Перейти до збережених оголошень
                    </ActionButton>
                </ProfileCard>
            </PageContainer>
        </Page>
    );
}