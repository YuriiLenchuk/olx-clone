'use client';

import styled, { keyframes } from 'styled-components';

const blink = keyframes`
    0%, 80%, 100% {
        opacity: 0.35;
        transform: translateY(0);
    }

    40% {
        opacity: 1;
        transform: translateY(-3px);
    }
`;

export const AssistantContainer = styled.div`
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 80;

    @media (max-width: 640px) {
        right: 16px;
        bottom: 16px;
        left: 16px;
    }
`;

export const AssistantToggle = styled.button`
    width: 58px;
    height: 58px;
    border: 0;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: #ffffff;
    background: var(--primary-dark, #2f5544);
    box-shadow: 0 16px 36px rgba(31, 49, 41, 0.22);

    font-size: 16px;
    font-weight: 900;
    letter-spacing: 0;

    transition: 0.18s ease;

    &:hover {
        transform: translateY(-2px);
        background: var(--primary, #3f6f58);
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 640px) {
        margin-left: auto;
    }
`;

export const AssistantPanel = styled.section`
    width: 390px;
    height: min(640px, calc(100vh - 112px));
    overflow: hidden;

    display: grid;
    grid-template-rows: auto 1fr auto;

    background: #ffffff;
    border: 1px solid var(--border, #dde3dd);
    border-radius: 8px;
    box-shadow: 0 22px 54px rgba(31, 49, 41, 0.2);

    @media (max-width: 640px) {
        width: 100%;
        height: min(620px, calc(100vh - 96px));
    }
`;

export const AssistantHeader = styled.header`
    min-height: 68px;
    padding: 14px 16px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    background: #f7f4ee;
    border-bottom: 1px solid var(--border, #dde3dd);
`;

export const AssistantTitle = styled.div`
    min-width: 0;
    display: grid;
    gap: 2px;

    span {
        color: var(--text, #1f3129);
        font-size: 16px;
        font-weight: 900;
        letter-spacing: 0;
    }

    small {
        color: var(--muted, #6f7a73);
        font-size: 12px;
        font-weight: 700;
    }
`;

export const CloseButton = styled.button`
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: var(--text, #1f3129);
    background: #ffffff;

    font-size: 24px;
    line-height: 1;

    transition: 0.18s ease;

    &:hover {
        background: #ece7dc;
    }
`;

export const Messages = styled.div`
    min-height: 0;
    padding: 16px;

    display: flex;
    flex-direction: column;
    gap: 12px;

    overflow-y: auto;
    background: #f8faf8;
`;

export const MessageBubble = styled.div<{ $role: 'user' | 'assistant' }>`
    width: fit-content;
    max-width: 100%;
    padding: 11px 12px;
    border-radius: 8px;

    align-self: ${({ $role }) => ($role === 'user' ? 'flex-end' : 'flex-start')};

    color: ${({ $role }) => ($role === 'user' ? '#ffffff' : 'var(--text, #1f3129)')};
    background: ${({ $role }) => ($role === 'user' ? 'var(--primary-dark, #2f5544)' : '#ffffff')};
    border: 1px solid ${({ $role }) => ($role === 'user' ? 'transparent' : 'var(--border, #dde3dd)')};

    p {
        margin: 0;
        white-space: pre-wrap;
        overflow-wrap: anywhere;

        font-size: 14px;
        line-height: 1.45;
    }
`;

export const Suggestions = styled.div`
    margin-top: 10px;

    display: grid;
    gap: 8px;
`;

export const SuggestionButton = styled.button`
    width: 100%;
    border: 1px solid var(--border, #dde3dd);
    border-radius: 8px;
    padding: 8px;

    display: grid;
    grid-template-columns: 54px minmax(0, 1fr);
    gap: 10px;
    align-items: center;

    text-align: left;
    color: var(--text, #1f3129);
    background: #fbfcfb;

    transition: 0.18s ease;

    &:hover {
        border-color: var(--primary, #3f6f58);
        background: #f3f7f4;
    }

    &:only-child {
        grid-template-columns: ${({ children }) => (children ? '54px minmax(0, 1fr)' : '1fr')};
    }
`;

export const SuggestionImage = styled.img`
    width: 54px;
    height: 54px;
    border-radius: 6px;

    object-fit: cover;
    background: #eef1ee;
`;

export const ItemInfo = styled.div`
    min-width: 0;
    display: grid;
    gap: 4px;
`;

export const ItemTitle = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    font-size: 13px;
    font-weight: 900;
`;

export const ItemMeta = styled.span`
    min-width: 0;

    display: flex;
    align-items: center;
    gap: 7px;

    color: var(--muted, #6f7a73);
    font-size: 12px;
    font-weight: 700;

    strong {
        color: var(--primary-dark, #2f5544);
        font-size: 12px;
    }
`;

export const ItemLocation = styled.span`
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const ItemReason = styled.span`
    color: var(--muted, #6f7a73);

    font-size: 12px;
    line-height: 1.35;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

export const Sources = styled.div`
    margin-top: 10px;
    padding-top: 9px;

    display: grid;
    gap: 5px;

    border-top: 1px solid var(--border, #dde3dd);
`;

export const SourcesTitle = styled.span`
    color: var(--muted, #6f7a73);
    font-size: 11px;
    font-weight: 900;
`;

export const SourceLink = styled.a`
    max-width: 100%;

    color: var(--primary-dark, #2f5544);

    font-size: 12px;
    font-weight: 700;
    line-height: 1.35;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
        text-decoration: underline;
    }
`;

export const LoadingDots = styled.div`
    height: 20px;

    display: inline-flex;
    align-items: center;
    gap: 4px;

    span {
        width: 6px;
        height: 6px;
        border-radius: 999px;

        background: var(--primary, #3f6f58);
        animation: ${blink} 1.1s infinite ease-in-out;
    }

    span:nth-child(2) {
        animation-delay: 0.15s;
    }

    span:nth-child(3) {
        animation-delay: 0.3s;
    }
`;

export const EmptyText = styled.p`
    margin: auto;

    color: var(--muted, #6f7a73);
    font-size: 14px;
    font-weight: 700;
`;

export const Form = styled.form`
    padding: 12px;

    display: grid;
    grid-template-columns: minmax(0, 1fr) 42px;
    gap: 8px;

    background: #ffffff;
    border-top: 1px solid var(--border, #dde3dd);
`;

export const Input = styled.input`
    min-width: 0;
    height: 42px;
    border: 1px solid var(--border, #dde3dd);
    border-radius: 8px;
    padding: 0 12px;

    color: var(--text, #1f3129);
    background: #ffffff;

    font-size: 14px;
    font-weight: 600;

    outline: none;

    &::placeholder {
        color: var(--muted, #6f7a73);
    }

    &:focus {
        border-color: var(--primary, #3f6f58);
        box-shadow: 0 0 0 3px rgba(63, 111, 88, 0.12);
    }

    &:disabled {
        color: var(--muted, #6f7a73);
        background: #f5f7f5;
    }
`;

export const SendButton = styled.button`
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 8px;

    display: grid;
    place-items: center;

    color: #ffffff;
    background: var(--primary-dark, #2f5544);

    font-size: 18px;
    font-weight: 900;

    transition: 0.18s ease;

    &:hover:not(:disabled) {
        background: var(--primary, #3f6f58);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;