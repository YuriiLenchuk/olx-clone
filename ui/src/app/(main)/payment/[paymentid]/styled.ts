'use client';

import styled from 'styled-components';
import { PaymentStatus } from '@/services/PaymentService';

export const Page = styled.main`
    min-height: 100vh;
    background: transparent;
`;

export const PageContainer = styled.div`
    width: min(1120px, calc(100% - 48px));
    margin: 0 auto;
    padding: 38px 0 80px;

    @media (max-width: 680px) {
        width: min(100% - 28px, 1120px);
        padding: 24px 0 56px;
    }
`;

export const PageHeader = styled.section`
    margin-bottom: 22px;
    padding: 24px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;

    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 28px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

    @media (max-width: 680px) {
        align-items: stretch;
        flex-direction: column;
    }
`;

export const PageTitle = styled.h1`
    color: var(--text, #1f2a24);
    font-size: clamp(34px, 4vw, 52px);
    line-height: 1.05;
    letter-spacing: -0.05em;
    font-weight: 950;
`;

export const PageDescription = styled.p`
    max-width: 660px;
    margin-top: 10px;

    color: var(--muted, #6f7a73);
    font-size: 16px;
    line-height: 1.6;
    font-weight: 700;
`;

export const PaymentGrid = styled.section`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 370px;
    gap: 22px;
    align-items: start;

    @media (max-width: 940px) {
        grid-template-columns: 1fr;
    }
`;

export const PaymentPanel = styled.article`
    padding: 28px;

    display: grid;
    gap: 18px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 30px;
    box-shadow: 0 22px 55px rgba(35, 45, 39, 0.1);

    h2 {
        color: var(--text, #1f2a24);
        font-size: clamp(28px, 3vw, 40px);
        line-height: 1.08;
        letter-spacing: -0.05em;
        font-weight: 950;
    }

    p {
        color: var(--muted, #6f7a73);
        font-size: 16px;
        line-height: 1.55;
        font-weight: 750;

        strong {
            color: var(--primary-dark, #2d4f3f);
            font-weight: 950;
        }
    }

    @media (max-width: 560px) {
        padding: 20px;
        border-radius: 24px;
    }
`;

export const SummaryCard = styled.aside`
    position: sticky;
    top: 96px;

    padding: 22px;

    display: grid;
    gap: 12px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 26px;
    box-shadow: 0 22px 55px rgba(35, 45, 39, 0.1);

    h2 {
        margin-bottom: 4px;

        color: var(--text, #1f2a24);
        font-size: 24px;
        letter-spacing: -0.04em;
        font-weight: 950;
    }

    @media (max-width: 940px) {
        position: static;
    }
`;

export const PaymentStatusBadge = styled.div<{ $status: PaymentStatus }>`
    width: fit-content;
    padding: 8px 12px;

    color: ${({ $status }) => {
        if ($status === 'paid_test') return 'var(--primary-dark, #2d4f3f)';
        if ($status === 'failed' || $status === 'cancelled') return '#bd4242';
        return '#8a6426';
    }};
    background: ${({ $status }) => {
        if ($status === 'paid_test') return 'rgba(220, 239, 227, 0.85)';
        if ($status === 'failed' || $status === 'cancelled') return '#fff5f5';
        return 'rgba(255, 241, 204, 0.9)';
    }};
    border: 1px solid
    ${({ $status }) => {
        if ($status === 'paid_test') return 'rgba(63, 111, 88, 0.22)';
        if ($status === 'failed' || $status === 'cancelled') {
            return 'rgba(212, 91, 91, 0.22)';
        }
        return 'rgba(242, 189, 87, 0.35)';
    }};
    border-radius: 999px;

    font-size: 13px;
    font-weight: 950;
`;

export const StepsList = styled.div`
    display: grid;
    gap: 10px;
`;

export const StepItem = styled.div<{ $active?: boolean }>`
    padding: 14px;

    display: flex;
    align-items: center;
    gap: 12px;

    color: ${({ $active }) =>
            $active ? 'var(--primary-dark, #2d4f3f)' : 'var(--muted, #6f7a73)'};
    background: ${({ $active }) =>
            $active ? 'rgba(220, 239, 227, 0.72)' : '#fbfaf7'};
    border: 1px solid
    ${({ $active }) =>
            $active ? 'rgba(63, 111, 88, 0.22)' : 'var(--border, #e8e1d6)'};
    border-radius: 18px;

    font-size: 14px;
    font-weight: 900;

    transition: 0.18s ease;

    span {
        width: 28px;
        height: 28px;

        display: grid;
        place-items: center;

        color: ${({ $active }) =>
                $active ? '#ffffff' : 'var(--muted, #6f7a73)'};
        background: ${({ $active }) =>
                $active ? 'var(--primary, #3f6f58)' : '#ffffff'};
        border-radius: 999px;

        font-size: 12px;
        font-weight: 950;
    }
`;

export const GooglePayBox = styled.div`
    display: grid;
    gap: 10px;

    > div {
        width: 100%;
    }

    button,
    div[role='button'] {
        width: 100%;
    }
`;

export const CardForm = styled.form`
    display: grid;
    gap: 12px;

    label {
        display: grid;
        gap: 8px;

        color: var(--text, #1f2a24);
        font-size: 14px;
        font-weight: 900;
    }
`;

export const TextInput = styled.input`
    width: 100%;
    height: 50px;
    padding: 0 15px;

    color: var(--text, #1f2a24);
    background: #fbfaf7;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 16px;
    outline: none;

    font-size: 15px;
    font-weight: 700;

    transition: 0.16s ease;

    &::placeholder {
        color: #a19a8e;
    }

    &:focus {
        background: #ffffff;
        border-color: rgba(63, 111, 88, 0.58);
        box-shadow: 0 0 0 4px rgba(63, 111, 88, 0.11);
    }
`;

export const PrimaryButton = styled.button`
    width: 100%;
    min-height: 52px;
    padding: 0 22px;

    color: #ffffff;
    background: var(--primary, #3f6f58);
    border: 0;
    border-radius: 17px;
    box-shadow: 0 14px 30px rgba(63, 111, 88, 0.24);

    font-size: 15px;
    font-weight: 950;

    cursor: pointer;
    transition: 0.16s ease;

    &:not(:disabled):hover {
        transform: translateY(-2px);
        background: var(--primary-dark, #2d4f3f);
    }

    &:disabled {
        opacity: 0.62;
        cursor: not-allowed;
        box-shadow: none;
    }
`;

export const SecondaryButton = styled.button`
    width: fit-content;
    min-height: 46px;
    padding: 0 18px;

    color: var(--primary-dark, #2d4f3f);
    background: var(--accent-soft, #fff1cc);
    border: 1px solid rgba(242, 189, 87, 0.35);
    border-radius: 999px;

    font-size: 14px;
    font-weight: 950;

    cursor: pointer;
    transition: 0.16s ease;

    &:not(:disabled):hover {
        transform: translateY(-2px);
        background: #ffe8a7;
        box-shadow: 0 12px 26px rgba(242, 189, 87, 0.18);
    }

    &:disabled {
        opacity: 0.62;
        cursor: not-allowed;
    }
`;

export const BackButton = styled(SecondaryButton)`
    min-width: 110px;
`;

export const SummaryLine = styled.div<{ $total?: boolean }>`
    padding: ${({ $total }) => ($total ? '16px 0 0' : '8px 0')};
    margin-top: ${({ $total }) => ($total ? '8px' : '0')};

    display: flex;
    justify-content: space-between;
    gap: 16px;

    border-top: ${({ $total }) =>
    $total ? '1px solid var(--border, #e8e1d6)' : '0'};

    span {
        color: ${({ $total }) =>
    $total ? 'var(--text, #1f2a24)' : 'var(--muted, #6f7a73)'};
        font-size: ${({ $total }) => ($total ? '16px' : '14px')};
        font-weight: ${({ $total }) => ($total ? '950' : '800')};
    }

    strong {
        max-width: 180px;

        color: ${({ $total }) =>
    $total ? 'var(--primary-dark, #2d4f3f)' : 'var(--text, #1f2a24)'};
        font-size: ${({ $total }) => ($total ? '20px' : '14px')};
        font-weight: 950;
        text-align: right;
        overflow-wrap: anywhere;
    }
`;

export const InfoCard = styled.div`
    padding: 14px;

    display: grid;
    gap: 5px;

    background: #fbfaf7;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 18px;

    span {
        color: var(--muted, #6f7a73);
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }

    strong {
        color: var(--text, #1f2a24);
        font-size: 15px;
        line-height: 1.35;
        font-weight: 950;
    }
`;

export const SuccessBox = styled.div`
    padding: 14px 16px;

    color: var(--primary-dark, #2d4f3f);
    background: rgba(220, 239, 227, 0.78);
    border: 1px solid rgba(63, 111, 88, 0.22);
    border-radius: 16px;

    font-size: 14px;
    line-height: 1.45;
    font-weight: 900;
`;

export const ErrorMessage = styled.div`
    padding: 14px 16px;

    color: var(--danger, #d45b5b);
    background: #fff5f5;
    border: 1px solid rgba(212, 91, 91, 0.22);
    border-radius: 16px;

    font-size: 14px;
    line-height: 1.45;
    font-weight: 900;
`;

export const LoadingCard = styled.div`
    padding: 40px;

    color: var(--muted, #6f7a73);
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 24px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

    font-size: 16px;
    font-weight: 900;
    text-align: center;
`;