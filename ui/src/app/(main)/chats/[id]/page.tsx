'use client';

import {
    FormEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';

import ChatService, { Chat, Message } from '@/services/ChatService';
import { getSocket } from '@/services/socket';

import {
    BackButton,
    ChatBody,
    ChatHeader,
    ChatShell,
    EmptyState,
    Form,
    Input,
    MessageBubble,
    MessagesList,
    Page,
    PageContainer,
    SendButton,
    UserInfo,
} from './styled';
import {getAuthToken} from "@/Utils/authToken";

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

export default function ChatPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const token = useMemo(() => getAuthToken() || '', []);
    const currentUserId = useMemo(() => getCurrentUserId(token), [token]);

    const companion = useMemo(() => {
        if (!chat) return null;

        return String(chat.buyer?._id) === String(currentUserId)
            ? chat.seller
            : chat.buyer;
    }, [chat, currentUserId]);

    useEffect(() => {
        async function loadChat() {
            try {
                if (!token) {
                    router.push('/registration');
                    return;
                }

                setIsLoading(true);

                const data = await ChatService.getChatById(token, params.id);

                setChat(data.chat);
                setMessages(data.messages);

                await ChatService.markAsRead(token, params.id);
            } catch (e: any) {
                setError(e?.message || 'Не вдалося завантажити чат');
            } finally {
                setIsLoading(false);
            }
        }

        if (params.id) {
            loadChat();
        }
    }, [params.id, router, token]);

    useEffect(() => {
        if (!token || !params.id) return;

        const socket = getSocket(token);

        socket.emit('chat:join', { chatId: params.id });

        socket.on('message:new', ({ message }: { message: Message }) => {
            if (String(message.chat) !== String(params.id)) return;

            setMessages((prev) => {
                const exists = prev.some((item) => item._id === message._id);

                if (exists) return prev;

                return [...prev, message];
            });

            socket.emit('message:read', { chatId: params.id });
        });

        socket.on('message:read', ({ chatId }) => {
            if (String(chatId) !== String(params.id)) return;

            setMessages((prev) =>
                prev.map((message) => ({
                    ...message,
                    isRead: true,
                })),
            );
        });

        return () => {
            socket.emit('chat:leave', { chatId: params.id });
            socket.off('message:new');
            socket.off('message:read');
        };
    }, [params.id, token]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [messages]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const normalizedText = text.trim();

        if (!normalizedText || !token || !params.id) return;

        const socket = getSocket(token);

        socket.emit(
            'message:send',
            {
                chatId: params.id,
                text: normalizedText,
            },
            (response: { ok: boolean; message?: Message; error?: string }) => {
                if (!response.ok) {
                    setError(response.error || 'Не вдалося надіслати повідомлення');
                    return;
                }

                setText('');
            },
        );
    }

    if (isLoading) {
        return (
            <Page>
                <PageContainer>
                    <EmptyState>Завантаження чату...</EmptyState>
                </PageContainer>
            </Page>
        );
    }

    if (error && !chat) {
        return (
            <Page>
                <PageContainer>
                    <EmptyState>{error}</EmptyState>
                </PageContainer>
            </Page>
        );
    }

    if (!chat) return null;

    return (
        <Page>
            <PageContainer>
                <ChatShell>
                    <ChatHeader>
                        <BackButton type="button" onClick={() => router.push('/chats')}>
                            Назад
                        </BackButton>

                        <UserInfo>
                            <span>Чат із продавцем</span>
                            <strong>{getUserName(companion || undefined)}</strong>
                            <p>{chat.item?.name || 'Оголошення'}</p>
                        </UserInfo>
                    </ChatHeader>

                    <ChatBody>
                        {messages.length === 0 ? (
                            <EmptyState>Повідомлень ще немає. Напишіть першим.</EmptyState>
                        ) : (
                            <MessagesList>
                                {messages.map((message) => {
                                    const isOwn = String(message.sender?._id) === String(currentUserId);

                                    return (
                                        <MessageBubble key={message._id} $own={isOwn}>
                                            <p>{message.text}</p>
                                            <span>
                        {new Date(message.createdAt).toLocaleTimeString('uk-UA', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                      </span>
                                        </MessageBubble>
                                    );
                                })}

                                <div ref={bottomRef} />
                            </MessagesList>
                        )}
                    </ChatBody>

                    <Form onSubmit={handleSubmit}>
                        <Input
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            placeholder="Напишіть повідомлення..."
                            maxLength={1000}
                        />

                        <SendButton type="submit" disabled={!text.trim()}>
                            Надіслати
                        </SendButton>
                    </Form>
                </ChatShell>
            </PageContainer>
        </Page>
    );
}