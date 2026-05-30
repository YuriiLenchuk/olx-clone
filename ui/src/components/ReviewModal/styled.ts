'use client';

import styled from 'styled-components';

export const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    z-index: 160;
    display: grid;
    place-items: center;
    padding: 18px;
    background: rgba(31, 42, 36, 0.42);
`;

export const Card = styled.div`
    width: min(560px, 100%);
    padding: 22px;
    background: #ffffff;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 24px;
    box-shadow: 0 24px 70px rgba(31, 42, 36, 0.24);

    form {
        display: grid;
        gap: 14px;
    }
`;

export const Header = styled.div`
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    gap: 14px;

    h2 {
        color: var(--text, #1f2a24);
        font-size: 24px;
        font-weight: 950;
    }

    p {
        margin-top: 6px;
        color: var(--muted, #6f7a73);
        font-size: 13px;
        font-weight: 800;
    }
`;

export const RatingRow = styled.div`
    display: flex;
    gap: 8px;
`;

export const RatingButton = styled.button<{ $active?: boolean }>`
    width: 44px;
    height: 44px;
    color: ${({ $active }) => ($active ? '#ffffff' : 'var(--primary-dark, #2d4f3f)')};
    background: ${({ $active }) => ($active ? 'var(--primary, #3f6f58)' : '#fbfaf7')};
    border: 1px solid ${({ $active }) => ($active ? 'rgba(63, 111, 88, 0.4)' : 'var(--border, #e8e1d6)')};
    border-radius: 14px;
    font-weight: 950;
    cursor: pointer;
`;

export const TextArea = styled.textarea`
    width: 100%;
    min-height: 130px;
    padding: 15px;
    color: var(--text, #1f2a24);
    background: #fbfaf7;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 16px;
    outline: none;
    font-size: 15px;
    font-weight: 700;
    resize: vertical;
`;

export const ErrorText = styled.p`
    color: var(--danger, #d45b5b);
    font-size: 13px;
    font-weight: 900;
`;

export const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

export const PrimaryButton = styled.button`
    min-height: 44px;
    padding: 0 16px;
    color: #ffffff;
    background: var(--primary, #3f6f58);
    border: 0;
    border-radius: 999px;
    font-weight: 950;
    cursor: pointer;

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }
`;

export const SecondaryButton = styled.button`
    min-height: 44px;
    padding: 0 16px;
    color: var(--primary-dark, #2d4f3f);
    background: var(--accent-soft, #fff1cc);
    border: 1px solid rgba(242, 189, 87, 0.35);
    border-radius: 999px;
    font-weight: 950;
    cursor: pointer;
`;