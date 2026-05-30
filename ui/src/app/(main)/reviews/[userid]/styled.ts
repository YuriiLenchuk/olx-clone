'use client';

import styled from 'styled-components';

export const Page = styled.main`
    min-height: 100vh;
    background: var(--bg, #f7f4ee);
`;

export const PageContainer = styled.div`
    width: min(960px, calc(100% - 48px));
    margin: 0 auto;
    padding: 38px 0 80px;
`;

export const Header = styled.section`
    margin-bottom: 18px;
    padding: 24px;
    display: flex;
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
    }

    h1 {
        margin-top: 6px;
        color: var(--text, #1f2a24);
        font-size: 44px;
        font-weight: 950;
    }
`;

export const BackButton = styled.button`
    min-height: 42px;
    padding: 0 15px;
    color: var(--primary-dark, #2d4f3f);
    background: var(--accent-soft, #fff1cc);
    border: 1px solid rgba(242, 189, 87, 0.35);
    border-radius: 999px;
    font-weight: 950;
    cursor: pointer;
`;

export const Stats = styled.div`
    margin-bottom: 18px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
`;

export const Stat = styled.article`
    padding: 20px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 24px;

    span {
        color: var(--muted, #6f7a73);
        font-size: 13px;
        font-weight: 900;
    }

    strong {
        margin-top: 8px;
        display: block;
        color: var(--primary-dark, #2d4f3f);
        font-size: 34px;
        font-weight: 950;
    }
`;

export const List = styled.div`
    display: grid;
    gap: 12px;
`;

export const ReviewCard = styled.article`
    padding: 18px;
    background: #ffffff;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 22px;

    div {
        display: flex;
        justify-content: space-between;
        gap: 12px;
    }

    strong {
        color: var(--text, #1f2a24);
        font-weight: 950;
    }

    span,
    p {
        margin-top: 8px;
        color: var(--muted, #6f7a73);
        font-size: 14px;
        line-height: 1.45;
        font-weight: 700;
    }

    b {
        margin-top: 10px;
        display: inline-block;
        color: var(--primary-dark, #2d4f3f);
        font-weight: 950;
    }
`;

export const EmptyState = styled.div<{ $danger?: boolean }>`
    padding: 20px;
    color: ${({ $danger }) => ($danger ? 'var(--danger, #d45b5b)' : 'var(--muted, #6f7a73)')};
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid ${({ $danger }) => ($danger ? 'rgba(212, 91, 91, 0.24)' : 'var(--border, #e8e1d6)')};
    border-radius: 22px;
    font-weight: 900;
    text-align: center;
`;