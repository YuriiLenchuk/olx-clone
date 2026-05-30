'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import ChatService, { Chat } from '@/services/ChatService';

import {
    ChatCard,
    ChatInfo,
    ChatList,
    EmptyState,
    ItemImage,
    LastMessage,
    Page,
    PageContainer,
    PageDescription,
    PageHeader,
    PageTitle,
    UserName,
} from './styled';
import {getAuthToken} from "@/Utils/authToken";

const IMAGE_URL = 'http://localhost:3005/img/';

function getCurrentUserId(token: string) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        return payload.id || '';
    } catch {
        return '';
    }
}

function getUserName(user?: { username?: string; firstName?: string; lastName?: string }) {
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

    return fullName || user?.username || 'Користувач';
}

export default function ChatsPage() {
    const router = useRouter();

    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const token = useMemo(() => getAuthToken() || '', []);
    const currentUserId = useMemo(() => getCurrentUserId(token), [token]);

    useEffect(() => {
        async function loadChats() {
            try {
                if (!token) {
                    router.push('/registration');
                    return;
                }

                setIsLoading(true);

                const data = await ChatService.getMyChats(token);

                setChats(data);
            } catch (e: any) {
                setError(e?.message || 'Не вдалося завантажити чати');
            } finally {
                setIsLoading(false);
            }
        }

        loadChats();
    }, [router, token]);

    function getCompanion(chat: Chat) {
        return String(chat.buyer?._id) === String(currentUserId)
            ? chat.seller
            : chat.buyer;
    }

    return (
        <Page>
            <PageContainer>
                <PageHeader>
                    <PageTitle>Повідомлення</PageTitle>
                    <PageDescription>
                        Тут зібрані всі діалоги з покупцями та продавцями.
                    </PageDescription>
                </PageHeader>

                {isLoading && <EmptyState>Завантаження чатів...</EmptyState>}

                {!isLoading && error && <EmptyState>{error}</EmptyState>}

                {!isLoading && !error && chats.length === 0 && (
                    <EmptyState>У вас поки немає чатів.</EmptyState>
                )}

                {!isLoading && !error && chats.length > 0 && (
                    <ChatList>
                        {chats.map((chat) => {
                            const companion = getCompanion(chat);
                            const firstImage = chat.item?.img?.[0];

                            return (
                                <ChatCard
                                    key={chat._id}
                                    type="button"
                                    onClick={() => router.push(`/chats/${chat._id}`)}
                                >
                                    {firstImage ? (
                                        <ItemImage src={`${IMAGE_URL}${firstImage}`} alt={chat.item?.name} />
                                    ) : (
                                        <ItemImage as="div">Фото</ItemImage>
                                    )}

                                    <ChatInfo>
                                        <UserName>{getUserName(companion)}</UserName>
                                        <strong>{chat.item?.name || 'Оголошення'}</strong>
                                        <LastMessage>
                                            {chat.lastMessageText || 'Повідомлень ще немає'}
                                        </LastMessage>
                                    </ChatInfo>
                                </ChatCard>
                            );
                        })}
                    </ChatList>
                )}
            </PageContainer>
        </Page>
    );
}