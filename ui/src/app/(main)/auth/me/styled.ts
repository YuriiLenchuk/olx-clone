'use client';

import styled from 'styled-components';

export const Page = styled.main`
    min-height: 100vh;
    background:
            radial-gradient(circle at 8% 8%, rgba(242, 189, 87, 0.24), transparent 28%),
            radial-gradient(circle at 92% 12%, rgba(63, 111, 88, 0.14), transparent 30%),
            var(--bg, #f7f4ee);
`;

export const PageContainer = styled.div`
    width: min(1120px, calc(100% - 48px));
    margin: 0 auto;
    padding: 38px 0 80px;
`;

export const Header = styled.section`
    margin-bottom: 18px;
    padding: 24px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;

    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 28px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

    @media (max-width: 760px) {
        align-items: stretch;
        flex-direction: column;
    }
`;

export const TitleBlock = styled.div`
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
        font-size: clamp(34px, 5vw, 54px);
        line-height: 1.05;
        letter-spacing: -0.05em;
        font-weight: 950;
    }

    p {
        max-width: 680px;
        margin-top: 10px;
        color: var(--muted, #6f7a73);
        font-size: 16px;
        line-height: 1.6;
        font-weight: 700;
    }
`;

export const Tabs = styled.div`
    margin-bottom: 18px;
    padding: 8px;

    display: flex;
    gap: 8px;
    overflow-x: auto;

    background: rgba(255, 255, 255, 0.78);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 22px;
`;

export const TabButton = styled.button<{ $active?: boolean }>`
    min-height: 44px;
    padding: 0 16px;

    white-space: nowrap;

    color: ${({ $active }) =>
            $active ? '#ffffff' : 'var(--primary-dark, #2d4f3f)'};
    background: ${({ $active }) =>
            $active ? 'var(--primary, #3f6f58)' : 'transparent'};
    border: 0;
    border-radius: 16px;

    font-size: 14px;
    font-weight: 950;

    cursor: pointer;
    transition: 0.16s ease;

    &:hover {
        background: ${({ $active }) =>
                $active ? 'var(--primary-dark, #2d4f3f)' : 'var(--accent-soft, #fff1cc)'};
    }
`;

export const Section = styled.section`
    display: grid;
    gap: 18px;
`;

export const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 520px) {
        grid-template-columns: 1fr;
    }
`;

export const StatCard = styled.article`
    padding: 20px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 24px;
    box-shadow: 0 16px 34px rgba(35, 45, 39, 0.07);

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
        line-height: 1;
        font-weight: 950;
    }
`;

export const InfoCard = styled.article<{ $danger?: boolean }>`
    padding: 24px;

    background: ${({ $danger }) =>
            $danger ? '#fff7f7' : 'rgba(255, 255, 255, 0.92)'};
    border: 1px solid
    ${({ $danger }) => ($danger ? 'rgba(212, 91, 91, 0.24)' : 'var(--border, #e8e1d6)')};
    border-radius: 26px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

    h2 {
        margin-bottom: 16px;

        color: ${({ $danger }) =>
                $danger ? 'var(--danger, #d45b5b)' : 'var(--text, #1f2a24)'};
        font-size: 24px;
        line-height: 1.15;
        letter-spacing: -0.04em;
        font-weight: 950;
    }

    form {
        display: grid;
        gap: 16px;
    }
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;

    p {
        padding: 14px;

        background: #fbfaf7;
        border: 1px solid var(--border, #e8e1d6);
        border-radius: 16px;

        span {
            display: block;
            color: var(--muted, #6f7a73);
            font-size: 13px;
            font-weight: 800;
        }

        strong {
            margin-top: 4px;
            display: block;
            color: var(--text, #1f2a24);
            font-size: 15px;
            font-weight: 950;
        }
    }

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
    }
`;

export const Field = styled.label`
    display: grid;
    gap: 8px;

    color: var(--text, #1f2a24);
    font-size: 14px;
    font-weight: 900;
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

    &:focus {
        background: #ffffff;
        border-color: rgba(63, 111, 88, 0.58);
        box-shadow: 0 0 0 4px rgba(63, 111, 88, 0.11);
    }
`;

export const TextArea = styled.textarea`
    width: 100%;
    min-height: 120px;
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

export const List = styled.div`
    display: grid;
    gap: 12px;
`;

export const ItemCard = styled.article`
    padding: 16px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    background: #fbfaf7;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 20px;

    strong {
        display: block;
        color: var(--text, #1f2a24);
        font-size: 16px;
        font-weight: 950;
    }

    span {
        margin-top: 5px;
        display: block;
        color: var(--muted, #6f7a73);
        font-size: 14px;
        font-weight: 700;
    }

    @media (max-width: 640px) {
        align-items: stretch;
        flex-direction: column;
    }
`;

export const Actions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 640px) {
        align-items: stretch;
        flex-direction: column;
    }
`;

export const PrimaryButton = styled.button`
    width: fit-content;
    min-height: 48px;
    padding: 0 18px;

    color: #ffffff;
    background: var(--primary, #3f6f58);
    border: 0;
    border-radius: 16px;
    box-shadow: 0 14px 30px rgba(63, 111, 88, 0.24);

    font-size: 14px;
    font-weight: 950;

    cursor: pointer;
    transition: 0.16s ease;

    &:hover {
        transform: translateY(-2px);
        background: var(--primary-dark, #2d4f3f);
    }
`;

export const SmallButton = styled.button`
    min-height: 42px;
    padding: 0 15px;

    color: var(--primary-dark, #2d4f3f);
    background: var(--accent-soft, #fff1cc);
    border: 1px solid rgba(242, 189, 87, 0.35);
    border-radius: 999px;

    font-size: 13px;
    font-weight: 950;

    cursor: pointer;
    transition: 0.16s ease;

    &:hover {
        transform: translateY(-2px);
        background: #ffe8a7;
    }
`;

export const DangerButton = styled.button`
    min-height: 48px;
    padding: 0 18px;
    margin: 16px 0;

    color: #ffffff;
    background: var(--danger, #d45b5b);
    border: 0;
    border-radius: 16px;

    font-size: 13px;
    font-weight: 950;

    cursor: pointer;
    transition: 0.16s ease;

    &:hover {
        transform: translateY(-2px);
        background: #bd4242;
    }
`;

export const EmptyState = styled.div<{ $danger?: boolean; $success?: boolean }>`
    padding: 20px;

    color: ${({ $danger, $success }) => {
        if ($danger) return 'var(--danger, #d45b5b)';
        if ($success) return 'var(--primary-dark, #2d4f3f)';
        return 'var(--muted, #6f7a73)';
    }};
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid
    ${({ $danger, $success }) => {
        if ($danger) return 'rgba(212, 91, 91, 0.24)';
        if ($success) return 'rgba(63, 111, 88, 0.22)';
        return 'var(--border, #e8e1d6)';
    }};
    border-radius: 22px;
    box-shadow: 0 14px 32px rgba(35, 45, 39, 0.06);

    font-size: 15px;
    line-height: 1.5;
    font-weight: 900;
    text-align: center;
`;