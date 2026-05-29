'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import AssistantService, {
    AssistantHistoryMessage,
    AssistantItem,
    AssistantRole,
    AssistantSource,
} from '@/services/AssistantService';

import {
    AssistantContainer,
    AssistantHeader,
    AssistantPanel,
    AssistantTitle,
    AssistantToggle,
    CloseButton,
    EmptyText,
    Form,
    Input,
    ItemInfo,
    ItemLocation,
    ItemMeta,
    ItemReason,
    ItemTitle,
    LoadingDots,
    MessageBubble,
    Messages,
    SendButton,
    SourceLink,
    Sources,
    SourcesTitle,
    SuggestionButton,
    SuggestionImage,
    Suggestions,
} from './styled';

type ChatMessage = {
    id: string;
    role: AssistantRole;
    content: string;
    items?: AssistantItem[];
    sources?: AssistantSource[];
};

const initialMessages: ChatMessage[] = [
    {
        id: 'initial-assistant-message',
        role: 'assistant',
        content: 'Привіт! Напишіть, що шукаєте, і я підберу товари з каталогу.',
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

export default function AIAssistant() {
    const router = useRouter();
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, isOpen]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const normalizedInput = input.trim();

        if (!normalizedInput || isLoading) return;

        const history: AssistantHistoryMessage[] = messages.map(message => ({
            role: message.role,
            content: message.content,
        }));

        setInput('');
        setIsLoading(true);
        setMessages(prev => [
            ...prev,
            createMessage('user', normalizedInput),
        ]);

        try {
            const response = await AssistantService.ask(normalizedInput, history);

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

                    <Form onSubmit={handleSubmit}>
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
                    </Form>
                </AssistantPanel>
            )}
        </AssistantContainer>
    );
}