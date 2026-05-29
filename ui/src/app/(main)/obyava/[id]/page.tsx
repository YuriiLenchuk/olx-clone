'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ChatService from '@/services/ChatService';
import { CategoryService, Item } from '@/services/CategoryService';
import date from '@/Utils/DateStr';
import Like from '@/icons/Like';

import {
    BackButton,
    Badge,
    Breadcrumbs,
    BuyButton,
    ContactButton,
    DescriptionCard,
    DetailsSection,
    EmptyImage,
    ErrorText,
    GalleryCard,
    GalleryGrid,
    InfoCard,
    InfoGrid,
    LikeButton,
    LoadingCard,
    MainImage,
    MetaItem,
    Page,
    PageContainer,
    Price,
    SellerAvatar,
    SellerCard,
    SellerInfo,
    SideColumn,
    StatusBadge,
    ThumbButton,
    Title,
    TopSection,
} from './styled';
import {getAuthToken} from "@/Utils/authToken";

const IMAGE_URL = 'http://localhost:3005/img/';

function formatPrice(price: number) {
    return new Intl.NumberFormat('uk-UA').format(price);
}

function getFavoriteIds(): string[] {
    const favoriteCookie = Cookies.get('checked');

    if (!favoriteCookie) return [];

    try {
        return JSON.parse(favoriteCookie);
    } catch {
        return [];
    }
}

export default function ItemPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const [item, setItem] = useState<Item | null>(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const images = useMemo(() => item?.img?.filter(Boolean) ?? [], [item]);

    useEffect(() => {
        async function loadItem() {
            try {
                setIsLoading(true);
                setError('');

                const itemData = await CategoryService.getItemById(params.id);

                setItem(itemData);
                setSelectedImage(itemData.img?.[0] || '');
                setIsFavorite(getFavoriteIds().includes(itemData._id));
            } catch (e) {
                setError('Не вдалося завантажити оголошення');
            } finally {
                setIsLoading(false);
            }
        }

        if (params.id) {
            loadItem();
        }
    }, [params.id]);

    function toggleFavorite() {
        if (!item) return;

        const favoriteIds = getFavoriteIds();

        if (favoriteIds.includes(item._id)) {
            const updatedIds = favoriteIds.filter((id) => id !== item._id);

            Cookies.set('checked', JSON.stringify(updatedIds));
            setIsFavorite(false);
            return;
        }

        favoriteIds.push(item._id);
        Cookies.set('checked', JSON.stringify(favoriteIds));
        setIsFavorite(true);
    }

    function handleBuy() {
        if (!item) return;

        const token = getAuthToken();

        if (!token) {
            router.push('/registration');
            return;
        }

        router.push(`/payment/${item._id}`);
    }

    async function handleContactSeller() {
        if (!item) return;

        const token = getAuthToken();

        if (!token) {
            router.push('/registration');
            return;
        }

        try {
            const chat = await ChatService.createOrGetChat(token, item._id);

            router.push(`/chats/${chat._id}`);
        } catch (e: any) {
            alert(e?.message || 'Не вдалося створити чат із продавцем');
        }
    }

    if (isLoading) {
        return (
            <Page>
                <PageContainer>
                    <LoadingCard>Завантаження оголошення...</LoadingCard>
                </PageContainer>
            </Page>
        );
    }

    if (error || !item) {
        return (
            <Page>
                <PageContainer>
                    <ErrorText>{error || 'Оголошення не знайдено'}</ErrorText>

                    <BackButton type="button" onClick={() => router.back()}>
                        Повернутися назад
                    </BackButton>
                </PageContainer>
            </Page>
        );
    }

    return (
        <Page>
            <PageContainer>
                <Breadcrumbs>
                    <button type="button" onClick={() => router.back()}>
                        Назад
                    </button>

                    <span>/</span>
                    <span>{item.categoryData?.category || 'Категорія'}</span>

                    {item.categoryData?.subcategory && (
                        <>
                            <span>/</span>
                            <span>{item.categoryData.subcategory}</span>
                        </>
                    )}
                </Breadcrumbs>

                <TopSection>
                    <GalleryCard>
                        {selectedImage ? (
                            <MainImage
                                src={`${IMAGE_URL}${selectedImage}`}
                                alt={item.name}
                            />
                        ) : (
                            <EmptyImage>Фото відсутнє</EmptyImage>
                        )}

                        {images.length > 1 && (
                            <GalleryGrid>
                                {images.map((image) => (
                                    <ThumbButton
                                        key={image}
                                        type="button"
                                        $active={selectedImage === image}
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <img src={`${IMAGE_URL}${image}`} alt={item.name} />
                                    </ThumbButton>
                                ))}
                            </GalleryGrid>
                        )}
                    </GalleryCard>

                    <SideColumn>
                        <InfoCard>
                            <StatusBadge>{item.isNewState ? 'Новий' : 'Б/в'}</StatusBadge>

                            <Title>{item.name}</Title>

                            <Price>{formatPrice(item.price)} грн</Price>

                            <InfoGrid>
                                <MetaItem>
                                    <span>Локація</span>
                                    <strong>{item.location}</strong>
                                </MetaItem>

                                <MetaItem>
                                    <span>Опубліковано</span>
                                    <strong>{date(item.date)}</strong>
                                </MetaItem>
                            </InfoGrid>

                            <LikeButton
                                type="button"
                                $active={isFavorite}
                                onClick={toggleFavorite}
                            >
                                <Like
                                    width={20}
                                    height={20}
                                    color="#3f6f58"
                                    checked={isFavorite}
                                />
                                {isFavorite ? 'В обраному' : 'Додати в обране'}
                            </LikeButton>

                            <BuyButton type="button" onClick={handleBuy}>
                                Купити
                            </BuyButton>
                        </InfoCard>

                        <SellerCard>
                            <SellerAvatar>
                                {(item.owner?.avatar || item.owner?.username || 'U').charAt(0).toUpperCase()}
                            </SellerAvatar>

                            <SellerInfo>
                                <span>Продавець</span>
                                <strong>{(item.owner?.firstName + ' ' + item.owner?.lastName) || item.owner?.username || 'Користувач'}</strong>
                                <p>На Local Market</p>
                            </SellerInfo>

                            <ContactButton type="button" onClick={handleContactSeller}>
                                Написати продавцю
                            </ContactButton>
                        </SellerCard>
                    </SideColumn>
                </TopSection>

                <DetailsSection>
                    <DescriptionCard>
                        <Badge>Опис</Badge>

                        <h2>Деталі оголошення</h2>

                        <p>{item.description || 'Опис для цього оголошення не додано.'}</p>
                    </DescriptionCard>
                </DetailsSection>
            </PageContainer>
        </Page>
    );
}