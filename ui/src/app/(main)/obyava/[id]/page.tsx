'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ChatService from '@/services/ChatService';
import AdminService from '@/services/AdminService';
import { getAuthToken, getValidAuthToken } from '@/Utils/authToken';
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
    ModalBackdrop,
    ModalCard,
    ModalError,
    ModalHeader,
    ModalText,
    ReportButton,
    ReportFormActions,
    ReportOption,
    ReportOptions,
    ReportTextarea,
    SecondaryButton,
    InfoCardTop,
    ReportIconButton,
    PageAlert,
    AdminActions,
    AdminButton,
    AdminDangerButton,
    AdminEditGrid,
    AdminField,
    AdminInput,
    AdminModalActions,
    AdminModalCard,
    AdminSelect,
    AdminTextarea,
} from './styled';
import {
    addCompareItem,
    ASSISTANT_COMPARE_UPDATED_EVENT,
    createCompareItemFromItem,
    getCompareItems, removeCompareItem
} from "@/Utils/assistantCompare";
import ReportService, {
    Report,
    ReportReason,
    REPORT_REASON_OPTIONS,
} from '@/services/ReportService';
import ItemService from "@/services/ItemService";
import UserService from "@/services/UserService";

const IMAGE_URL = 'http://localhost:3005/img/';

type AdminEditForm = {
    name: string;
    description: string;
    price: string;
    location: string;
    isNewState: boolean;
};

function getInitialAdminEditForm(item: Item): AdminEditForm {
    return {
        name: item.name || '',
        description: item.description || '',
        price: String(item.price || ''),
        location: item.location || '',
        isNewState: Boolean(item.isNewState),
    };
}

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

function isItemInCompare(itemId: string) {
    return getCompareItems().some((item) => item.id === itemId);
}

export default function ItemPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const [item, setItem] = useState<Item | null>(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCompareAdded, setIsCompareAdded] = useState(false);
    const [report, setReport] = useState<Report | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState<ReportReason>('fraud');
    const [reportComment, setReportComment] = useState('');
    const [isReportSubmitting, setIsReportSubmitting] = useState(false);
    const [reportError, setReportError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
    const [adminEditForm, setAdminEditForm] = useState<AdminEditForm | null>(null);
    const [isAdminActionLoading, setIsAdminActionLoading] = useState(false);
    const [adminActionError, setAdminActionError] = useState('');

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
                const token = getAuthToken();

                if (token) {
                    try {
                        const currentUser = await UserService.me(token);

                        setIsAdmin(Boolean(currentUser.roles?.includes('ADMIN')));
                    } catch {
                        setIsAdmin(false);
                    }

                    try {
                        const existingReport = await ReportService.getMyReportForItem(
                            token,
                            itemData._id,
                        );

                        setReport(existingReport);
                    } catch {
                        setReport(null);
                    }
                } else {
                    setIsAdmin(false);
                }

                setIsCompareAdded(isItemInCompare(itemData._id));
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

    useEffect(() => {
        if (!item) return;

        function syncCompareState() {
            setIsCompareAdded(isItemInCompare(item!._id));
        }

        window.addEventListener(ASSISTANT_COMPARE_UPDATED_EVENT, syncCompareState);
        window.addEventListener('storage', syncCompareState);

        return () => {
            window.removeEventListener(ASSISTANT_COMPARE_UPDATED_EVENT, syncCompareState);
            window.removeEventListener('storage', syncCompareState);
        };
    }, [item]);

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

    function toggleCompare() {
        if (!item) return;

        if (isCompareAdded) {
            removeCompareItem(item._id);
            setIsCompareAdded(false);
            return;
        }

        addCompareItem(createCompareItemFromItem(item));
        setIsCompareAdded(true);
    }

    function handleBuy() {
        if (!item) return;

        const token = getAuthToken();

        if (!token) {
            router.push('/registration');
            return;
        }

        router.push(`/checkout/${item._id}`);
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

    function openReportModal() {
        if (!item) return;

        const token = getAuthToken();

        if (!token) {
            router.push('/registration');
            return;
        }

        if (report) return;

        setReportError('');
        setIsReportModalOpen(true);
    }

    function closeReportModal() {
        if (isReportSubmitting) return;

        setIsReportModalOpen(false);
        setReportError('');
        setReportComment('');
        setReportReason('fraud');
    }

    async function handleReportSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!item) return;

        const token = getAuthToken();

        if (!token) {
            router.push('/registration');
            return;
        }

        try {
            setIsReportSubmitting(true);
            setReportError('');

            const createdReport = await ReportService.createReport(token, {
                itemId: item._id,
                reason: reportReason,
                comment: reportComment,
            });

            setReport(createdReport);
            closeReportModal();
        } catch (e: any) {
            setReportError(e?.message || 'Не вдалося відправити скаргу');
        } finally {
            setIsReportSubmitting(false);
        }
    }

    function openAdminEditModal() {
        if (!item) return;

        setAdminEditForm(getInitialAdminEditForm(item));
        setAdminActionError('');
        setIsAdminEditOpen(true);
    }

    function closeAdminEditModal() {
        if (isAdminActionLoading) return;

        setIsAdminEditOpen(false);
        setAdminActionError('');
        setAdminEditForm(null);
    }

    function handleAdminEditChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) {
        const { name, value } = event.target;

        setAdminEditForm((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                [name]: name === 'isNewState' ? value === 'true' : value,
            };
        });
    }

    async function handleAdminEditSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!item || !adminEditForm) return;

        const token = getValidAuthToken();

        if (!adminEditForm.location.trim()) {
            setAdminActionError('Вкажіть місто');
            return;
        }

        if (!token) {
            router.push('/registration');
            return;
        }

        const price = Number(adminEditForm.price);

        if (!adminEditForm.name.trim()) {
            setAdminActionError('Вкажіть назву оголошення');
            return;
        }

        if (!Number.isFinite(price) || price <= 0) {
            setAdminActionError('Ціна має бути більшою за 0');
            return;
        }

        try {
            setIsAdminActionLoading(true);
            setAdminActionError('');

            const updatedItem = await ItemService.updateItem(token, item._id, {
                name: adminEditForm.name.trim(),
                description: adminEditForm.description.trim(),
                price,
                location: adminEditForm.location.trim(),
                isNewState: adminEditForm.isNewState,
            });

            setItem(updatedItem);
            closeAdminEditModal();
        } catch (e: any) {
            setAdminActionError(e?.message || 'Не вдалося оновити оголошення');
        } finally {
            setIsAdminActionLoading(false);
        }
    }

    async function handleAdminArchiveItem() {
        if (!item) return;

        const token = getValidAuthToken();

        if (!token) {
            router.push('/registration');
            return;
        }

        const confirmed = window.confirm(`Архівувати оголошення "${item.name}"?`);

        if (!confirmed) return;

        try {
            setIsAdminActionLoading(true);
            setAdminActionError('');

            await AdminService.archiveItem(token, item._id);

            router.push('/home');
        } catch (e: any) {
            setAdminActionError(e?.message || 'Не вдалося архівувати оголошення');
        } finally {
            setIsAdminActionLoading(false);
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

                {report && (
                    <PageAlert>
                        <strong>Скаргу відправлено</strong>
                        <span>
                            Вона вже передана адміністраторам. Статус: {report.status}
                        </span>
                    </PageAlert>
                )}

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
                            <InfoCardTop>
                                <StatusBadge>{item.isNewState ? 'Новий' : 'Б/в'}</StatusBadge>

                                <ReportIconButton
                                    type="button"
                                    disabled={Boolean(report)}
                                    onClick={openReportModal}
                                    title={report ? 'Скаргу вже відправлено' : 'Поскаржитися'}
                                    aria-label={report ? 'Скаргу вже відправлено' : 'Поскаржитися'}
                                >
                                    !
                                </ReportIconButton>
                            </InfoCardTop>

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

                            <LikeButton
                                type="button"
                                $active={isCompareAdded}
                                onClick={toggleCompare}
                            >
                                {isCompareAdded ? 'У порівнянні' : 'Додати до порівняння'}
                            </LikeButton>

                            <BuyButton type="button" onClick={handleBuy}>
                                Купити
                            </BuyButton>

                            {isAdmin && (
                                <AdminActions>
                                    <AdminButton type="button" onClick={openAdminEditModal}>
                                        Редагувати оголошення
                                    </AdminButton>

                                    <AdminDangerButton
                                        type="button"
                                        disabled={isAdminActionLoading}
                                        onClick={handleAdminArchiveItem}
                                    >
                                        Архівувати оголошення
                                    </AdminDangerButton>

                                    {adminActionError && <ModalError>{adminActionError}</ModalError>}
                                </AdminActions>
                            )}

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
            {isReportModalOpen && (
                <ModalBackdrop>
                    <ModalCard>
                        <ModalHeader>
                            <div>
                                <h2>Поскаржитися на оголошення</h2>
                                <p>{item.name}</p>
                            </div>

                            <SecondaryButton type="button" onClick={closeReportModal}>
                                Закрити
                            </SecondaryButton>
                        </ModalHeader>

                        <form onSubmit={handleReportSubmit}>
                            <ModalText>Оберіть причину скарги</ModalText>

                            <ReportOptions>
                                {REPORT_REASON_OPTIONS.map((option) => (
                                    <ReportOption
                                        key={option.value}
                                        type="button"
                                        $active={reportReason === option.value}
                                        onClick={() => setReportReason(option.value)}
                                    >
                                        {option.label}
                                    </ReportOption>
                                ))}
                            </ReportOptions>

                            <ModalText>Коментар</ModalText>

                            <ReportTextarea
                                value={reportComment}
                                onChange={(event) => setReportComment(event.target.value)}
                                placeholder="Опишіть проблему, якщо потрібно"
                                maxLength={1000}
                            />

                            {reportError && <ModalError>{reportError}</ModalError>}

                            <ReportFormActions>
                                <SecondaryButton type="button" onClick={closeReportModal}>
                                    Скасувати
                                </SecondaryButton>

                                <ReportButton type="submit" disabled={isReportSubmitting}>
                                    {isReportSubmitting ? 'Відправлення...' : 'Відправити скаргу'}
                                </ReportButton>
                            </ReportFormActions>
                        </form>
                    </ModalCard>
                </ModalBackdrop>
            )}
            {isAdminEditOpen && adminEditForm && (
                <ModalBackdrop>
                    <AdminModalCard>
                        <ModalHeader>
                            <div>
                                <h2>Редагувати оголошення</h2>
                                <p>{item.name}</p>
                            </div>

                            <SecondaryButton type="button" onClick={closeAdminEditModal}>
                                Закрити
                            </SecondaryButton>
                        </ModalHeader>

                        <form onSubmit={handleAdminEditSubmit}>
                            <AdminEditGrid>
                                <AdminField>
                                    <span>Назва</span>
                                    <AdminInput
                                        name="name"
                                        value={adminEditForm.name}
                                        onChange={handleAdminEditChange}
                                    />
                                </AdminField>

                                <AdminField>
                                    <span>Ціна, грн</span>
                                    <AdminInput
                                        name="price"
                                        type="number"
                                        min="1"
                                        value={adminEditForm.price}
                                        onChange={handleAdminEditChange}
                                    />
                                </AdminField>

                                <AdminField>
                                    <span>Місто</span>
                                    <AdminInput
                                        name="location"
                                        value={adminEditForm.location}
                                        onChange={handleAdminEditChange}
                                    />
                                </AdminField>

                                <AdminField>
                                    <span>Стан</span>
                                    <AdminSelect
                                        name="isNewState"
                                        value={String(adminEditForm.isNewState)}
                                        onChange={handleAdminEditChange}
                                    >
                                        <option value="false">Б/в</option>
                                        <option value="true">Новий</option>
                                    </AdminSelect>
                                </AdminField>
                            </AdminEditGrid>

                            <AdminField>
                                <span>Опис</span>
                                <AdminTextarea
                                    name="description"
                                    value={adminEditForm.description}
                                    onChange={handleAdminEditChange}
                                />
                            </AdminField>

                            {adminActionError && <ModalError>{adminActionError}</ModalError>}

                            <AdminModalActions>
                                <SecondaryButton type="button" onClick={closeAdminEditModal}>
                                    Скасувати
                                </SecondaryButton>

                                <ReportButton type="submit" disabled={isAdminActionLoading}>
                                    {isAdminActionLoading ? 'Збереження...' : 'Зберегти зміни'}
                                </ReportButton>
                            </AdminModalActions>
                        </form>
                    </AdminModalCard>
                </ModalBackdrop>
            )}
        </Page>
    );
}