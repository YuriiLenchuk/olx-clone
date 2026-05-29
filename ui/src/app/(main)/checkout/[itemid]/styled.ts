'use client';

import styled from 'styled-components';

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
    font-size: clamp(32px, 4vw, 48px);
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

export const CheckoutGrid = styled.section`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 22px;
    align-items: start;

    @media (max-width: 940px) {
        grid-template-columns: 1fr;
    }
`;

export const CheckoutCard = styled.article`
    padding: 26px;

    display: grid;
    gap: 18px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 28px;
    box-shadow: 0 22px 55px rgba(35, 45, 39, 0.1);
    backdrop-filter: blur(14px);

    @media (max-width: 560px) {
        padding: 18px;
        border-radius: 24px;
    }
`;

export const SummaryCard = styled.aside`
    position: sticky;
    top: 96px;

    padding: 22px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 26px;
    box-shadow: 0 22px 55px rgba(35, 45, 39, 0.1);

    h2 {
        margin-bottom: 14px;

        color: var(--text, #1f2a24);
        font-size: 24px;
        letter-spacing: -0.04em;
        font-weight: 950;
    }

    @media (max-width: 940px) {
        position: static;
    }
`;

export const SummaryLine = styled.div<{ $total?: boolean }>`
    padding: ${({ $total }) => ($total ? '18px 0 0' : '11px 0')};
    margin-top: ${({ $total }) => ($total ? '10px' : '0')};

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
        font-size: ${({ $total }) => ($total ? '21px' : '14px')};
        font-weight: 950;
        text-align: right;
    }
`;

export const ItemPreview = styled.div`
    padding: 14px;

    display: grid;
    grid-template-columns: 96px 1fr;
    gap: 14px;
    align-items: center;

    background: #fbfaf7;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 22px;

    div {
        min-width: 0;
    }

    span {
        color: var(--muted, #6f7a73);
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }

    strong {
        margin-top: 4px;
        display: block;

        color: var(--text, #1f2a24);
        font-size: 18px;
        line-height: 1.25;
        font-weight: 950;
    }

    p {
        margin-top: 6px;

        color: var(--primary-dark, #2d4f3f);
        font-size: 18px;
        font-weight: 950;
    }

    @media (max-width: 520px) {
        grid-template-columns: 78px 1fr;
    }
`;

export const ItemImage = styled.img`
    width: 96px;
    height: 96px;

    display: grid;
    place-items: center;

    object-fit: cover;

    color: var(--muted, #6f7a73);
    background: #f5f1e8;
    border-radius: 18px;

    font-size: 12px;
    font-weight: 900;
    text-align: center;

    @media (max-width: 520px) {
        width: 78px;
        height: 78px;
    }
`;

export const Field = styled.div`
    display: grid;
    gap: 9px;

    label {
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

export const TextArea = styled.textarea`
    width: 100%;
    min-height: 112px;
    padding: 15px;

    resize: vertical;

    color: var(--text, #1f2a24);
    background: #fbfaf7;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 18px;
    outline: none;

    font-size: 15px;
    line-height: 1.55;
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

export const DeliveryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    @media (max-width: 780px) {
        grid-template-columns: 1fr;
    }
`;

export const MethodGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    @media (max-width: 780px) {
        grid-template-columns: 1fr;
    }
`;

export const RadioCard = styled.button<{ $active?: boolean }>`
    min-height: 92px;
    padding: 15px;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    text-align: left;

    color: ${({ $active }) =>
    $active ? 'var(--primary-dark, #2d4f3f)' : 'var(--text, #1f2a24)'};
    background: ${({ $active }) =>
    $active ? 'var(--accent-soft, #fff1cc)' : '#fbfaf7'};
    border: 1px solid
        ${({ $active }) =>
    $active ? 'rgba(242, 189, 87, 0.75)' : 'var(--border, #e8e1d6)'};
    border-radius: 18px;

    cursor: pointer;
    transition: 0.16s ease;

    strong {
        font-size: 15px;
        font-weight: 950;
    }

    span {
        margin-top: 5px;

        color: var(--muted, #6f7a73);
        font-size: 13px;
        line-height: 1.35;
        font-weight: 700;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 26px rgba(35, 45, 39, 0.06);
    }
`;

export const MethodCard = styled(RadioCard)`
    min-height: 104px;
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

export const BackButton = styled.button`
    min-height: 44px;
    padding: 0 18px;

    color: var(--primary-dark, #2d4f3f);
    background: var(--accent-soft, #fff1cc);
    border: 1px solid rgba(242, 189, 87, 0.35);
    border-radius: 999px;

    font-size: 14px;
    font-weight: 950;

    cursor: pointer;
    transition: 0.16s ease;

    &:hover {
        transform: translateY(-2px);
        background: #ffe8a7;
        box-shadow: 0 12px 26px rgba(242, 189, 87, 0.18);
    }
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