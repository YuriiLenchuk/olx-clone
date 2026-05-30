'use client';

import styled, { css } from 'styled-components';
import { ReportStatus } from '@/services/ReportService';

export const Page = styled.main`
    min-height: 100vh;
    background: var(--bg, #f7f4ee);
`;

export const PageContainer = styled.div`
    width: min(1180px, calc(100% - 48px));
    margin: 0 auto;
    padding: 34px 0 80px;

    @media (max-width: 680px) {
        width: min(100% - 28px, 1180px);
        padding: 22px 0 54px;
    }
`;

export const Header = styled.header`
    margin-bottom: 22px;

    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;

    @media (max-width: 720px) {
        flex-direction: column;
    }
`;

export const TitleBlock = styled.div`
    max-width: 720px;

    h1 {
        margin-top: 10px;
        color: var(--text, #1f2a24);
        font-size: clamp(34px, 6vw, 58px);
        line-height: 0.98;
        font-weight: 950;
    }

    p {
        margin-top: 14px;
        color: var(--muted, #6f7a73);
        font-size: 16px;
        line-height: 1.55;
        font-weight: 700;
    }
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: 10px;
`;

export const AdminBadge = styled.span`
    width: fit-content;
    padding: 7px 11px;

    display: inline-flex;
    align-items: center;

    color: var(--primary-dark, #2d4f3f);
    background: var(--accent-soft, #fff1cc);
    border-radius: 999px;

    font-size: 12px;
    font-weight: 900;
`;

export const Filters = styled.div`
    margin-bottom: 18px;

    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
    min-height: 42px;
    padding: 0 16px;

    color: ${({ $active }) => ($active ? '#ffffff' : 'var(--text, #1f2a24)')};
    background: ${({ $active }) => ($active ? 'var(--primary, #3f6f58)' : '#ffffff')};
    border: 1px solid ${({ $active }) => ($active ? 'var(--primary, #3f6f58)' : 'var(--border, #e8e1d6)')};
    border-radius: 14px;

    font-size: 14px;
    font-weight: 900;

    cursor: pointer;
    transition: 0.16s ease;

    &:hover {
        transform: translateY(-2px);
        border-color: rgba(63, 111, 88, 0.38);
    }
`;

export const ReportList = styled.div`
    display: grid;
    gap: 16px;
`;

export const ReportCard = styled.article`
    padding: 18px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 22px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);
`;

export const ReportHeader = styled.div`
    margin-bottom: 16px;

    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;

    h2 {
        margin-top: 8px;
        color: var(--text, #1f2a24);
        font-size: 22px;
        line-height: 1.18;
        font-weight: 950;
    }

    > span {
        color: var(--muted, #6f7a73);
        font-size: 13px;
        font-weight: 800;
        white-space: nowrap;
    }
`;

const statusStyles = {
    pending: css`
        color: #8a5408;
        background: #fff4d8;
        border-color: rgba(242, 189, 87, 0.58);
    `,
    reviewed: css`
        color: #2d4f3f;
        background: #e8f3ed;
        border-color: rgba(63, 111, 88, 0.26);
    `,
    resolved: css`
        color: #1f5f3a;
        background: #e7f7ed;
        border-color: rgba(31, 95, 58, 0.24);
    `,
    dismissed: css`
        color: #8a3434;
        background: #fff0f0;
        border-color: rgba(212, 91, 91, 0.28);
    `,
};

export const StatusBadge = styled.span<{ $status: ReportStatus }>`
    width: fit-content;
    padding: 6px 10px;

    display: inline-flex;

    border: 1px solid;
    border-radius: 999px;

    font-size: 12px;
    font-weight: 900;

    ${({ $status }) => statusStyles[$status]}
`;

export const ReportGrid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
    gap: 14px;

    @media (max-width: 820px) {
        grid-template-columns: 1fr;
    }
`;

export const ItemPreview = styled.div`
    min-width: 0;
    padding: 12px;

    display: grid;
    grid-template-columns: 82px minmax(0, 1fr);
    gap: 12px;
    align-items: center;

    background: #f8f5ef;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 16px;

    img {
        width: 82px;
        height: 82px;

        object-fit: cover;

        background: #f5f1e8;
        border-radius: 14px;
    }

    strong {
        display: block;

        color: var(--text, #1f2a24);
        font-size: 16px;
        line-height: 1.25;
        font-weight: 950;
    }

    span {
        margin-top: 6px;

        display: block;

        color: var(--muted, #6f7a73);
        font-size: 13px;
        font-weight: 800;
    }
`;

export const MetaGrid = styled.div`
    display: grid;
    gap: 8px;

    p {
        margin: 0;
        padding: 12px;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;

        background: #f8f5ef;
        border: 1px solid var(--border, #e8e1d6);
        border-radius: 14px;
    }

    span {
        color: var(--muted, #6f7a73);
        font-size: 13px;
        font-weight: 800;
    }

    strong {
        color: var(--text, #1f2a24);
        font-size: 13px;
        font-weight: 950;
        text-align: right;
    }
`;

export const ReportComment = styled.div`
    margin-top: 14px;
    padding: 12px 14px;

    background: #fffaf0;
    border: 1px solid rgba(242, 189, 87, 0.42);
    border-radius: 16px;

    span {
        color: #7a4a11;
        font-size: 12px;
        font-weight: 950;
    }

    p {
        margin-top: 6px;

        color: var(--text, #1f2a24);
        font-size: 14px;
        line-height: 1.55;
        font-weight: 700;
        white-space: pre-line;
    }
`;

export const TextArea = styled.textarea`
    width: 100%;
    min-height: 92px;
    margin-top: 14px;
    padding: 12px 14px;

    resize: vertical;

    color: var(--text, #1f2a24);
    background: #f8f5ef;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 14px;

    font-size: 14px;
    font-weight: 700;
    line-height: 1.5;

    outline: none;

    &:focus {
        border-color: var(--primary, #3f6f58);
        box-shadow: 0 0 0 3px rgba(63, 111, 88, 0.12);
    }
`;

export const Actions = styled.div`
    margin-top: 14px;

    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

export const buttonBase = css`
    min-height: 42px;
    padding: 0 14px;

    border-radius: 14px;

    font-size: 13px;
    font-weight: 900;

    cursor: pointer;
    transition: 0.16s ease;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

export const PrimaryButton = styled.button`
    ${buttonBase};

    color: #ffffff;
    background: var(--primary, #3f6f58);
    border: 1px solid var(--primary, #3f6f58);
`;

export const SecondaryButton = styled.button<{ $danger?: boolean }>`
    ${buttonBase};

    color: ${({ $danger }) => ($danger ? '#9b2f2f' : 'var(--text, #1f2a24)')};
    background: ${({ $danger }) => ($danger ? '#fff5f5' : '#ffffff')};
    border: 1px solid ${({ $danger }) => ($danger ? 'rgba(212, 91, 91, 0.28)' : 'var(--border, #e8e1d6)')};
`;

export const Select = styled.select`
    min-height: 42px;
    padding: 0 12px;

    color: var(--text, #1f2a24);
    background: #ffffff;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 14px;

    font-size: 13px;
    font-weight: 900;

    outline: none;
`;

export const EmptyState = styled.div<{ $success?: boolean }>`
    padding: 20px;

    color: ${({ $success }) => ($success ? '#1f5f3a' : 'var(--muted, #6f7a73)')};
    background: ${({ $success }) => ($success ? '#e7f7ed' : '#ffffff')};
    border: 1px solid ${({ $success }) => ($success ? 'rgba(31, 95, 58, 0.24)' : 'var(--border, #e8e1d6)')};
    border-radius: 18px;

    font-size: 14px;
    font-weight: 900;
    text-align: center;
`;

export const ErrorMessage = styled.div`
    margin-bottom: 14px;
    padding: 14px 16px;

    color: #9b2f2f;
    background: #fff5f5;
    border: 1px solid rgba(212, 91, 91, 0.28);
    border-radius: 16px;

    font-size: 14px;
    font-weight: 900;
`;

export const Pagination = styled.div`
    margin-top: 18px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    color: var(--muted, #6f7a73);
    font-size: 14px;
    font-weight: 800;

    div {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    strong {
        color: var(--text, #1f2a24);
    }

    @media (max-width: 640px) {
        align-items: flex-start;
        flex-direction: column;
    }
`;

export const Tabs = styled.div`
    margin-bottom: 18px;

    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

export const TabButton = styled.button<{ $active?: boolean }>`
    min-height: 44px;
    padding: 0 16px;

    color: ${({ $active }) => ($active ? '#ffffff' : 'var(--text, #1f2a24)')};
    background: ${({ $active }) => ($active ? 'var(--primary, #3f6f58)' : '#ffffff')};
    border: 1px solid ${({ $active }) => ($active ? 'var(--primary, #3f6f58)' : 'var(--border, #e8e1d6)')};
    border-radius: 14px;

    font-size: 14px;
    font-weight: 900;

    cursor: pointer;
`;

export const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;

    @media (max-width: 980px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 560px) {
        grid-template-columns: 1fr;
    }
`;

export const StatCard = styled.article`
    padding: 18px;

    background: #ffffff;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 18px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

    span {
        color: var(--muted, #6f7a73);
        font-size: 13px;
        font-weight: 900;
    }

    strong {
        margin-top: 10px;

        display: block;

        color: var(--text, #1f2a24);
        font-size: 38px;
        line-height: 1;
        font-weight: 950;
    }

    p {
        margin-top: 10px;

        color: var(--muted, #6f7a73);
        font-size: 13px;
        font-weight: 800;
        line-height: 1.45;
    }
`;

export const SearchRow = styled.div`
    margin-bottom: 16px;

    display: grid;
    grid-template-columns: minmax(220px, 1fr) auto auto auto;
    gap: 10px;

    @media (max-width: 760px) {
        grid-template-columns: 1fr;
    }
`;

export const SearchInput = styled.input`
    min-height: 42px;
    padding: 0 14px;

    color: var(--text, #1f2a24);
    background: #ffffff;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 14px;

    font-size: 14px;
    font-weight: 800;

    outline: none;

    &:focus {
        border-color: var(--primary, #3f6f58);
        box-shadow: 0 0 0 3px rgba(63, 111, 88, 0.12);
    }
`;