'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import FavoriteService from '@/services/FavoriteService';
import { getValidAuthToken } from '@/Utils/authToken';
import Link from 'next/link';

import ItemCard from '@/components/ItemCard/page';
import { Item } from '@/services/CategoryService';

import {
    ActionButton,
    EmptyCard,
    EmptyIcon,
    ErrorCard,
    HeaderActions,
    ItemsList,
    Page,
    PageContainer,
    PageDescription,
    PageHeader,
    PageTitle,
    StatsBadge,
    ContentFade,
    SkeletonBlock,
    WishlistSkeletonCard,
    WishlistSkeletonInfo,
} from './styled';
import {getAuthToken} from "@/Utils/authToken";

function WishListSkeleton() {
    return (
        <Page>
            <PageContainer>
                <ContentFade>
                    <PageHeader>
                        <div>
                            <SkeletonBlock $width="340px" $height="46px" />
                            <div style={{ marginTop: 12 }}>
                                <SkeletonBlock $width="520px" $height="18px" />
                            </div>
                        </div>

                        <HeaderActions>
                            <SkeletonBlock $width="130px" $height="42px" />
                        </HeaderActions>
                    </PageHeader>

                    <ItemsList>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <WishlistSkeletonCard key={index}>
                                <SkeletonBlock
                                    $width="100%"
                                    $height="130px"
                                    $radius="20px"
                                />

                                <WishlistSkeletonInfo>
                                    <SkeletonBlock $width="70%" $height="24px" />
                                    <SkeletonBlock $width="42%" $height="18px" />
                                    <SkeletonBlock $width="88%" $height="16px" />
                                    <SkeletonBlock $width="160px" $height="36px" />
                                </WishlistSkeletonInfo>
                            </WishlistSkeletonCard>
                        ))}
                    </ItemsList>
                </ContentFade>
            </PageContainer>
        </Page>
    );
}
export default function WishList() {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const totalItems = useMemo(() => items.length, [items]);

    async function loadWishlist() {
        try {
            setIsLoading(true);
            setError('');

            const token = getValidAuthToken();

            if (!token) {
                router.push('/registration');
                return;
            }

            const response = await FavoriteService.getFavorites(token);

            setItems(response.items || []);
        } catch (e) {
            setError('Не вдалося завантажити збережені оголошення');
        } finally {
            setIsLoading(false);
        }
    }

    async function clearWishlist() {
        const token = getValidAuthToken();

        if (!token) {
            router.push('/registration');
            return;
        }

        await FavoriteService.clearFavorites(token);
        setItems([]);
    }

    useEffect(() => {
        loadWishlist();
    }, []);

    if (isLoading) {
        return <WishListSkeleton />;
    }

    if (error) {
        return (
            <Page>
                <PageContainer>
                    <PageHeader>
                        <div>
                            <PageTitle>Збережені оголошення</PageTitle>
                            <PageDescription>
                                Не вдалося отримати список обраних товарів.
                            </PageDescription>
                        </div>
                    </PageHeader>

                    <ErrorCard>
                        <strong>{error}</strong>
                        <ActionButton type="button" onClick={loadWishlist}>
                            Спробувати ще раз
                        </ActionButton>
                    </ErrorCard>
                </PageContainer>
            </Page>
        );
    }

    return (
        <Page>
            <PageContainer>
                <PageHeader>
                    <div>
                        <PageTitle>Збережені оголошення</PageTitle>
                        <PageDescription>
                            Швидкий доступ до товарів, які вас зацікавили.
                        </PageDescription>
                    </div>

                    <HeaderActions>
                        <StatsBadge>
                            {totalItems} {totalItems === 1 ? 'оголошення' : 'оголошень'}
                        </StatsBadge>

                        {totalItems > 0 && (
                            <ActionButton type="button" onClick={clearWishlist}>
                                Очистити список
                            </ActionButton>
                        )}
                    </HeaderActions>
                </PageHeader>

                {items.length > 0 ? (
                    <ItemsList>
                        {items.map((item) => (
                            <ItemCard
                                key={item._id}
                                item={item}
                                checked
                                onFavoriteChange={(itemId, isSelected) => {
                                    if (!isSelected) {
                                        setItems((prev) => prev.filter((item) => item._id !== itemId));
                                    }
                                }}
                            />
                        ))}
                    </ItemsList>
                ) : (
                    <EmptyCard>
                        <EmptyIcon>♡</EmptyIcon>
                        <h2>Ви ще нічого не зберегли</h2>
                        <p>
                            Натискайте на сердечко біля оголошень, щоб додавати їх у цей
                            список.
                        </p>

                        <Link href="/home">Перейти на головну</Link>
                    </EmptyCard>
                )}
            </PageContainer>
        </Page>
    );
}