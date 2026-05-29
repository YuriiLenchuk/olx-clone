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

export const Header = styled.section`
    margin-bottom: 22px;
    padding: 24px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 28px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

    span {
        color: var(--primary-dark, #2d4f3f);
        font-size: 13px;
        font-weight: 950;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    h1 {
        margin-top: 6px;
        color: var(--text, #1f2a24);
        font-size: clamp(32px, 4vw, 48px);
        line-height: 1.05;
        font-weight: 950;
    }

    @media (max-width: 720px) {
        align-items: stretch;
        flex-direction: column;
    }
`;

export const DetailGrid = styled.section`
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
    gap: 18px;
    align-items: start;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

export const SummaryCard = styled.article`
    padding: 24px;
    
    margin: 18px 0;

    display: grid;
    gap: 18px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 26px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

    h2 {
        color: var(--text, #1f2a24);
        font-size: 24px;
        line-height: 1.15;
        font-weight: 950;
    }
`;

export const ItemPreview = styled.div`
    display: grid;
    grid-template-columns: 170px minmax(0, 1fr);
    gap: 18px;
    align-items: center;

    span {
        color: var(--muted, #6f7a73);
        font-size: 13px;
        font-weight: 900;
    }

    strong {
        margin-top: 6px;
        display: block;
        color: var(--text, #1f2a24);
        font-size: 24px;
        line-height: 1.15;
        font-weight: 950;
    }

    p {
        margin-top: 8px;
        color: var(--primary-dark, #2d4f3f);
        font-size: 20px;
        font-weight: 950;
    }

    @media (max-width: 620px) {
        grid-template-columns: 1fr;
    }
`;

export const ItemImage = styled.img`
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;

    background: #fbfaf7;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 20px;
`;

export const EmptyPhoto = styled.div`
    width: 100%;
    aspect-ratio: 4 / 3;

    display: grid;
    place-items: center;

    color: var(--muted, #6f7a73);
    background: #fbfaf7;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 20px;

    font-size: 14px;
    font-weight: 900;
`;

export const ActionBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

export const PrimaryButton = styled.button`
    min-height: 46px;
    padding: 0 18px;

    color: #ffffff;
    background: var(--primary, #3f6f58);
    border: 0;
    border-radius: 16px;
    box-shadow: 0 14px 30px rgba(63, 111, 88, 0.22);

    font-size: 14px;
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
    }

    &:disabled {
        opacity: 0.62;
        cursor: not-allowed;
    }
`;

export const BackButton = styled(SecondaryButton)``;

export const StatusBadge = styled.div<{ $tone: 'success' | 'warning' | 'danger' }>`
    width: fit-content;
    padding: 9px 13px;

    color: ${({ $tone }) => {
    if ($tone === 'success') return 'var(--primary-dark, #2d4f3f)';
    if ($tone === 'danger') return '#bd4242';
    return '#8a6426';
}};
    background: ${({ $tone }) => {
    if ($tone === 'success') return 'rgba(220, 239, 227, 0.85)';
    if ($tone === 'danger') return '#fff5f5';
    return 'rgba(255, 241, 204, 0.9)';
}};
    border: 1px solid
        ${({ $tone }) => {
    if ($tone === 'success') return 'rgba(63, 111, 88, 0.22)';
    if ($tone === 'danger') return 'rgba(212, 91, 91, 0.22)';
    return 'rgba(242, 189, 87, 0.35)';
}};
    border-radius: 999px;

    font-size: 13px;
    font-weight: 950;
`;

export const SummaryLine = styled.div<{ $total?: boolean }>`
    padding: ${({ $total }) => ($total ? '16px 0 0' : '8px 0')};
    margin-top: ${({ $total }) => ($total ? '6px' : '0')};

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
        max-width: 220px;

        color: ${({ $total }) =>
    $total ? 'var(--primary-dark, #2d4f3f)' : 'var(--text, #1f2a24)'};
        font-size: ${({ $total }) => ($total ? '20px' : '14px')};
        font-weight: 950;
        text-align: right;
        overflow-wrap: anywhere;
    }
`;

export const InfoBlock = styled.div<{ $danger?: boolean }>`
    padding: 14px;

    display: grid;
    gap: 5px;

    color: ${({ $danger }) =>
    $danger ? 'var(--danger, #d45b5b)' : 'var(--text, #1f2a24)'};
    background: ${({ $danger }) => ($danger ? '#fff5f5' : '#fbfaf7')};
    border: 1px solid
        ${({ $danger }) =>
    $danger ? 'rgba(212, 91, 91, 0.22)' : 'var(--border, #e8e1d6)'};
    border-radius: 18px;

    span {
        color: ${({ $danger }) =>
    $danger ? 'var(--danger, #d45b5b)' : 'var(--muted, #6f7a73)'};
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }

    strong {
        color: inherit;
        font-size: 15px;
        line-height: 1.35;
        font-weight: 950;
    }
`;

export const ErrorBox = styled.div`
    padding: 16px;

    color: var(--danger, #d45b5b);
    background: #fff5f5;
    border: 1px solid rgba(212, 91, 91, 0.22);
    border-radius: 18px;

    font-size: 14px;
    line-height: 1.45;
    font-weight: 900;
`;