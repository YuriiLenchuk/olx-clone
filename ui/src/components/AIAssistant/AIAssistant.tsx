'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import AssistantService, {
    AssistantHistoryMessage,
    AssistantItem,
    AssistantRole,
    AssistantSource,
} from '@/services/AssistantService';
import { CategoryService } from '@/services/CategoryService';
import {
    addCompareItem,
    ASSISTANT_COMPARE_UPDATED_EVENT,
    clearCompareItems,
    CompareItem,
    createCompareItemFromItem,
    getCompareItems,
    removeCompareItem,
} from '@/Utils/assistantCompare';

import {
    AssistantContainer,
    AssistantHeader,
    AssistantPanel,
    AssistantTitle,
    AssistantToggle,
    ChatForm,
    ClearCompareButton,
    CloseButton,
    CompareButton,
    CompareEmpty,
    CompareForm,
    CompareHeader,
    CompareHint,
    CompareInput,
    CompareItemCard,
    CompareItemImage,
    CompareItemImageFallback,
    CompareItemInfo,
    CompareItemMeta,
    CompareItemTitle,
    CompareList,
    CompareOpenButton,
    CompareSection,
    CompareTitle,
    CurrentItemButton,
    EmptyText,
    Input,
    ItemInfo,
    ItemLocation,
    ItemMeta,
    ItemReason,
    ItemTitle,
    LoadingDots,
    MessageBubble,
    Messages,
    RemoveCompareButton,
    SendButton,
    SourceLink,
    Sources,
    SourcesTitle,
    SuggestionButton,
    SuggestionImage,
    Suggestions,
    ToggleBadge,
} from './styled';

type ChatMessage = {
    id: string;
    role: AssistantRole;
    content: string;
    items?: AssistantItem[];
    sources?: AssistantSource[];
};

const MAX_HISTORY_MESSAGES = 8;

const initialMessages: ChatMessage[] = [
    {
        id: 'initial-assistant-message',
        role: 'assistant',
        content: 'Привіт! Напишіть, що шукаєте, або додайте кілька оголошень до порівняння.',
    },
];

function createMessage(
    role: AssistantRole,
    content: string,
    items: AssistantItem[] = [],
    sources: AssistantSource[] = [],
): ChatMessage {
    return {
        id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role,
        content,
        items,
        sources,
    };
}

function getImageUrl(image?: string | null) {
    if (!image) return '';

    if (image.startsWith('http')) {
        return image;
    }

    return `http://localhost:3005/img/${image}`;
}

function getItemIdFromPathname(pathname: string | null) {
    const match = String(pathname || '').match(/\/obyava\/([^/?#]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

function getHistory(messages: ChatMessage[]): AssistantHistoryMessage[] {
    return messages
        .slice(-MAX_HISTORY_MESSAGES)
        .map(message => ({
            role: message.role,
            content: message.content,
        }));
}

function buildCompareMessage(compareItems: CompareItem[], question: string) {
    const urls = compareItems.map(item => item.url).join('\n');
    const normalizedQuestion = question.trim();

    return [
        'Порівняй ці оголошення:',
        urls,
        normalizedQuestion
            ? `Що саме порівняти: ${normalizedQuestion}`
            : 'Зроби загальне порівняння за ціною, станом, описом, містом, ризиками і дай фінальну рекомендацію.',
        'Якщо потрібно, використай актуальну інформацію з інтернету, але відділяй її від даних самих оголошень.',
    ].join('\n\n');
}

function buildVisibleCompareMessage(compareItems: CompareItem[], question: string) {
    const normalizedQuestion = question.trim();
    const itemTitles = compareItems
        .map((item, index) => `${index + 1}. ${item.title}`)
        .join('\n');

    return [
        'Порівняй ці оголошення:',
        itemTitles,
        normalizedQuestion
            ? `Фокус порівняння: ${normalizedQuestion}`
            : 'Фокус порівняння: загальна оцінка ціни, стану, опису, міста, ризиків і фінальна рекомендація.',
    ].join('\n\n');
}

export default function AIAssistant() {
    const router = useRouter();
    const pathname = usePathname();
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [compareQuestion, setCompareQuestion] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
    const [currentPageItem, setCurrentPageItem] = useState<CompareItem | null>(null);

    const currentItemId = useMemo(() => getItemIdFromPathname(pathname), [pathname]);

    const isCurrentItemAdded = useMemo(() => {
        if (!currentPageItem) return false;

        return compareItems.some(item => item.id === currentPageItem.id);
    }, [compareItems, currentPageItem]);

    useEffect(() => {
        function syncCompareItems() {
            setCompareItems(getCompareItems());
        }

        syncCompareItems();

        window.addEventListener(ASSISTANT_COMPARE_UPDATED_EVENT, syncCompareItems);
        window.addEventListener('storage', syncCompareItems);

        return () => {
            window.removeEventListener(ASSISTANT_COMPARE_UPDATED_EVENT, syncCompareItems);
            window.removeEventListener('storage', syncCompareItems);
        };
    }, []);

    useEffect(() => {
        let isActive = true;

        async function loadCurrentItem() {
            if (!currentItemId) {
                setCurrentPageItem(null);
                return;
            }

            try {
                const item = await CategoryService.getItemById(currentItemId);

                if (isActive) {
                    setCurrentPageItem(createCompareItemFromItem(item));
                }
            } catch {
                if (isActive) {
                    setCurrentPageItem(null);
                }
            }
        }

        loadCurrentItem();

        return () => {
            isActive = false;
        };
    }, [currentItemId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, isOpen]);

    async function sendMessage(message: string, visibleMessage?: string) {
        const normalizedMessage = message.trim();
        const normalizedVisibleMessage = (visibleMessage || message).trim();

        if (!normalizedMessage || isLoading) return;

        const history = getHistory(messages);

        setIsOpen(true);
        setIsLoading(true);
        setMessages(prev => [
            ...prev,
            createMessage('user', normalizedVisibleMessage),
        ]);

        try {
            const response = await AssistantService.ask(normalizedMessage, history);

            setMessages(prev => [
                ...prev,
                createMessage(
                    'assistant',
                    response.answer,
                    response.items,
                    response.grounding?.sources || [],
                ),
            ]);
        } catch (error: any) {
            setMessages(prev => [
                ...prev,
                createMessage(
                    'assistant',
                    error?.message || 'Не вдалося отримати відповідь. Спробуйте ще раз.',
                ),
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const normalizedInput = input.trim();

        if (!normalizedInput) return;

        setInput('');
        await sendMessage(normalizedInput);
    }

    async function handleCompareSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (compareItems.length < 2) return;

        const message = buildCompareMessage(compareItems, compareQuestion);
        const visibleMessage = buildVisibleCompareMessage(compareItems, compareQuestion);

        setCompareQuestion('');
        await sendMessage(message, visibleMessage);
    }

    function handleAddCurrentItem() {
        if (!currentPageItem) return;

        addCompareItem(currentPageItem);
        setIsOpen(true);
    }

    function handleRemoveCompareItem(id: string) {
        removeCompareItem(id);
    }

    function handleClearCompareItems() {
        clearCompareItems();
    }

    function openItem(url: string) {
        setIsOpen(false);
        router.push(url);
    }

    return (
        <AssistantContainer>
            {!isOpen && (
                <AssistantToggle
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Відкрити AI-консультанта"
                >
                    AI
                    {!!compareItems.length && <ToggleBadge>{compareItems.length}</ToggleBadge>}
                </AssistantToggle>
            )}

            {isOpen && (
                <AssistantPanel>
                    <AssistantHeader>
                        <AssistantTitle>
                            <span>AI-консультант</span>
                            <small>Local Market</small>
                        </AssistantTitle>

                        <CloseButton
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Закрити AI-консультанта"
                        >
                            ×
                        </CloseButton>
                    </AssistantHeader>

                    <CompareSection>
                        <CompareHeader>
                            <CompareTitle>Порівняння</CompareTitle>

                            {!!compareItems.length && (
                                <ClearCompareButton type="button" onClick={handleClearCompareItems}>
                                    Очистити
                                </ClearCompareButton>
                            )}
                        </CompareHeader>

                        {currentPageItem && !isCurrentItemAdded && (
                            <CurrentItemButton type="button" onClick={handleAddCurrentItem}>
                                Додати поточну обʼяву
                            </CurrentItemButton>
                        )}

                        {compareItems.length ? (
                            <CompareList>
                                {compareItems.map(item => (
                                    <CompareItemCard key={item.id}>
                                        <CompareOpenButton
                                            type="button"
                                            onClick={() => openItem(item.url)}
                                        >
                                            {item.image ? (
                                                <CompareItemImage
                                                    src={getImageUrl(item.image)}
                                                    alt={item.title}
                                                />
                                            ) : (
                                                <CompareItemImageFallback>
                                                    {item.title.charAt(0).toUpperCase()}
                                                </CompareItemImageFallback>
                                            )}

                                            <CompareItemInfo>
                                                <CompareItemTitle>{item.title}</CompareItemTitle>

                                                <CompareItemMeta>
                                                    <strong>{item.price} грн.</strong>
                                                    <span>{item.location}</span>
                                                </CompareItemMeta>
                                            </CompareItemInfo>
                                        </CompareOpenButton>

                                        <RemoveCompareButton
                                            type="button"
                                            onClick={() => handleRemoveCompareItem(item.id)}
                                            aria-label="Видалити з порівняння"
                                        >
                                            ×
                                        </RemoveCompareButton>
                                    </CompareItemCard>
                                ))}
                            </CompareList>
                        ) : (
                            <CompareEmpty>
                                Відкрийте оголошення і додайте його сюди для порівняння.
                            </CompareEmpty>
                        )}

                        {compareItems.length === 1 && (
                            <CompareHint>Додайте ще одну обʼяву, щоб запустити порівняння.</CompareHint>
                        )}

                        {compareItems.length >= 2 && (
                            <CompareForm onSubmit={handleCompareSubmit}>
                                <CompareInput
                                    value={compareQuestion}
                                    onChange={event => setCompareQuestion(event.target.value)}
                                    placeholder="Що саме порівняти?"
                                    disabled={isLoading}
                                />

                                <CompareButton type="submit" disabled={isLoading}>
                                    Порівняти
                                </CompareButton>
                            </CompareForm>
                        )}
                    </CompareSection>

                    <Messages>
                        {messages.map(message => (
                            <MessageBubble key={message.id} $role={message.role}>
                                <p>{message.content}</p>

                                {!!message.items?.length && (
                                    <Suggestions>
                                        {message.items.map(item => (
                                            <SuggestionButton
                                                key={item.id}
                                                type="button"
                                                onClick={() => openItem(item.url)}
                                            >
                                                {item.image && (
                                                    <SuggestionImage
                                                        src={getImageUrl(item.image)}
                                                        alt={item.title}
                                                    />
                                                )}

                                                <ItemInfo>
                                                    <ItemTitle>{item.title}</ItemTitle>

                                                    <ItemMeta>
                                                        {typeof item.price === 'number' && (
                                                            <strong>{item.price} грн.</strong>
                                                        )}

                                                        {item.location && (
                                                            <ItemLocation>{item.location}</ItemLocation>
                                                        )}
                                                    </ItemMeta>

                                                    <ItemReason>{item.reason}</ItemReason>
                                                </ItemInfo>
                                            </SuggestionButton>
                                        ))}
                                    </Suggestions>
                                )}

                                {!!message.sources?.length && (
                                    <Sources>
                                        <SourcesTitle>Джерела</SourcesTitle>

                                        {message.sources.map(source => (
                                            <SourceLink
                                                key={source.uri}
                                                href={source.uri}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {source.title || source.uri}
                                            </SourceLink>
                                        ))}
                                    </Sources>
                                )}
                            </MessageBubble>
                        ))}

                        {isLoading && (
                            <MessageBubble $role="assistant">
                                <LoadingDots>
                                    <span />
                                    <span />
                                    <span />
                                </LoadingDots>
                            </MessageBubble>
                        )}

                        {!messages.length && (
                            <EmptyText>Почніть діалог із консультантом.</EmptyText>
                        )}

                        <div ref={bottomRef} />
                    </Messages>

                    <ChatForm onSubmit={handleSubmit}>
                        <Input
                            value={input}
                            onChange={event => setInput(event.target.value)}
                            placeholder="Що шукаєте?"
                            disabled={isLoading}
                        />

                        <SendButton
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            aria-label="Надіслати повідомлення"
                        >
                            ↑
                        </SendButton>
                    </ChatForm>
                </AssistantPanel>
            )}
        </AssistantContainer>
    );
}