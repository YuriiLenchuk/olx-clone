'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ReviewService, { Review } from '@/services/ReviewService';
import {
    BackButton,
    EmptyState,
    Header,
    List,
    Page,
    PageContainer,
    ReviewCard,
    Stat,
    Stats,
} from './styled';
import UserService, {AuthUser} from "@/services/UserService";

function getAuthorName(review: Review) {
    const fullName = `${review.author?.firstName || ''} ${review.author?.lastName || ''}`.trim();

    return fullName || review.author?.username || 'Користувач';
}

export default function ReviewsPage() {
    const router = useRouter();
    const params = useParams();

    const userId = useMemo(() => {
        const value = params.userId || params.userid;

        if (Array.isArray(value)) return value[0];

        return value ? String(value) : '';
    }, [params]);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const averageRating = useMemo(() => {
        if (!reviews.length) return 0;

        const sum = reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0);

        return sum / reviews.length;
    }, [reviews]);

    useEffect(() => {
        async function loadReviews() {
            if (!userId) {
                setError('Не вдалося визначити користувача');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                const data = await ReviewService.getUserReviews(userId, 1, 100);

                setReviews(data.reviews || []);
                setTotalReviews(data.totalReviews || 0);
            } catch (e: any) {
                setError(e?.message || 'Не вдалося завантажити відгуки');
            } finally {
                setIsLoading(false);
            }
        }

        loadReviews();
    }, [userId]);

    return (
        <Page>
            <PageContainer>
                <Header>
                    <div>

                        <span>Репутація користувача</span>
                        <h1>{!isLoading && !error && reviews.length > 0 &&  reviews[0].targetUser.firstName + ' ' + reviews[0].targetUser.lastName}</h1>
                    </div>

                    <BackButton type="button" onClick={() => router.back()}>
                        Назад
                    </BackButton>
                </Header>

                <Stats>
                    <Stat>
                        <span>Всього відгуків</span>
                        <strong>{totalReviews}</strong>
                    </Stat>

                    <Stat>
                        <span>Середня оцінка</span>
                        <strong>{averageRating.toFixed(1)}</strong>
                    </Stat>
                </Stats>

                {isLoading && <EmptyState>Завантаження відгуків...</EmptyState>}
                {error && <EmptyState $danger>{error}</EmptyState>}

                {!isLoading && !error && reviews.length === 0 && (
                    <EmptyState>У цього користувача ще немає відгуків.</EmptyState>
                )}

                {!isLoading && !error && reviews.length > 0 && (
                    <List>
                        {reviews.map((review) => (
                            <ReviewCard key={review._id}>
                                <div>
                                    <strong>{getAuthorName(review)}</strong>
                                    <span>{new Date(review.createdAt).toLocaleDateString('uk-UA')}</span>
                                </div>

                                <b>{review.rating}/5</b>

                                {review.item && <p>Оголошення: {review.item.name}</p>}
                                {review.comment && <p>{review.comment}</p>}
                            </ReviewCard>
                        ))}
                    </List>
                )}
            </PageContainer>
        </Page>
    );
}