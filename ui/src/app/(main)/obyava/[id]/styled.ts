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
    width: min(1180px, calc(100% - 48px));
    margin: 0 auto;
    padding: 34px 0 80px;

    @media (max-width: 680px) {
        width: min(100% - 28px, 1180px);
        padding: 22px 0 54px;
    }
`;

export const Breadcrumbs = styled.div`
    margin-bottom: 18px;

    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    color: var(--muted, #6f7a73);
    font-size: 14px;
    font-weight: 800;

    button {
        padding: 0;

        color: var(--primary-dark, #2d4f3f);
        background: transparent;
        border: 0;

        font: inherit;

        cursor: pointer;

        &:hover {
            text-decoration: underline;
            text-underline-offset: 4px;
        }
    }
`;

export const TopSection = styled.section`
    height: clamp(420px, 44vw, 525px);
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.65fr);
    gap: 22px;
    align-items: stretch;

    @media (max-width: 920px) {
        grid-template-columns: 1fr;
    }
`;

export const DetailsSection = styled.section`
    margin-top: 22px;

    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
    gap: 22px;
    align-items: start;

    @media (max-width: 920px) {
        grid-template-columns: 1fr;
    }
`;

export const GalleryCard = styled.article`
    height: 100%;
    min-height: 0;
    padding: 14px;

    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 12px;

    background: rgba(255, 255, 255, 0.88);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 24px;
    box-shadow: 0 22px 55px rgba(35, 45, 39, 0.1);
    overflow: hidden;

    @media (max-width: 920px) {
        height: auto;
    }
`;

export const MainImage = styled.img`
    width: 100%;
    height: 100%;
    min-height: 0;

    display: block;

    object-fit: contain;

    background: #f5f1e8;
    border-radius: 20px;

    @media (max-width: 920px) {
        height: clamp(300px, 48vw, 440px);
    }
`;

export const EmptyImage = styled.div`
    width: 100%;
    height: 100%;
    min-height: 0;

    display: grid;
    place-items: center;

    color: var(--muted, #6f7a73);
    background: #f5f1e8;
    border-radius: 20px;

    font-size: 16px;
    font-weight: 900;

    @media (max-width: 920px) {
        height: clamp(300px, 48vw, 440px);
    }
`;

export const GalleryGrid = styled.div`
    margin-top: 12px;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(86px, 1fr));
    gap: 10px;
`;

export const ThumbButton = styled.button<{ $active?: boolean }>`
    height: 84px;
    padding: 4px;

    overflow: hidden;

    background: #f5f1e8;
    border: 2px solid
    ${({ $active }) => ($active ? 'var(--primary, #3f6f58)' : 'transparent')};
    border-radius: 14px;

    cursor: pointer;
    transition: 0.16s ease;

    img {
        width: 100%;
        height: 100%;

        object-fit: cover;

        border-radius: 10px;
    }

    &:hover {
        transform: translateY(-2px);
        border-color: rgba(63, 111, 88, 0.38);
    }
`;

export const SideColumn = styled.aside`
    min-height: 100%;
    
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const InfoCard = styled.article`
    position: sticky;
    top: 96px;
    padding: 22px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 24px;
    box-shadow: 0 22px 55px rgba(35, 45, 39, 0.1);
    backdrop-filter: blur(14px);

    @media (max-width: 920px) {
        position: static;
    }
`;

export const StatusBadge = styled.span`
    width: fit-content;
    margin-bottom: 14px;
    padding: 7px 11px;

    display: inline-flex;

    color: var(--primary-dark, #2d4f3f);
    background: var(--accent-soft, #fff1cc);
    border-radius: 999px;

    font-size: 12px;
    font-weight: 900;
`;

export const Title = styled.h1`
    margin-bottom: 14px;

    color: var(--text, #1f2a24);

    font-size: clamp(24px, 4vw, 30px);
    line-height: 1.08;
    letter-spacing: -0.05em;
`;

export const Price = styled.p`
    margin-bottom: 20px;

    color: var(--primary-dark, #2d4f3f);

    font-size: 26px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -0.04em;
`;

export const InfoGrid = styled.div`
    display: grid;
    gap: 10px;
`;

export const MetaItem = styled.div`
    padding: 12px 14px;

    display: flex;
    justify-content: space-between;
    gap: 16px;

    background: #f8f5ef;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 16px;

    span {
        color: var(--muted, #6f7a73);
        font-size: 13px;
        font-weight: 800;
    }

    strong {
        color: var(--text, #1f2a24);
        font-size: 13px;
        font-weight: 900;
        text-align: right;
    }
`;

export const LikeButton = styled.button<{ $active?: boolean }>`
    width: 100%;
    height: 50px;
    margin-top: 20px;
    padding: 0 18px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;

    color: ${({ $active }) =>
            $active ? 'var(--primary-dark, #2d4f3f)' : 'var(--text, #1f2a24)'};
    background: ${({ $active }) =>
            $active ? 'var(--accent-soft, #fff1cc)' : '#f8f5ef'};
    border: 1px solid
    ${({ $active }) =>
            $active ? 'rgba(63, 111, 88, 0.32)' : 'var(--border, #e8e1d6)'};
    border-radius: 16px;

    font-size: 14px;
    font-weight: 900;

    cursor: pointer;
    transition: 0.16s ease;

    &:hover {
        transform: translateY(-2px);
        border-color: rgba(63, 111, 88, 0.32);
        box-shadow: 0 14px 30px rgba(35, 45, 39, 0.08);
    }
`;

export const BuyButton = styled.button`
    width: 100%;
    height: 50px;
    margin-top: 10px;
    padding: 0 18px;

    color: #ffffff;
    background: var(--primary, #3f6f58);
    border: 0;
    border-radius: 16px;
    box-shadow: 0 14px 30px rgba(63, 111, 88, 0.24);

    font-size: 15px;
    font-weight: 950;

    cursor: pointer;
    transition: 0.16s ease;

    &:hover {
        transform: translateY(-2px);
        background: var(--primary-dark, #2d4f3f);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const SellerCard = styled.article`
    position: sticky;
    top: 96px;

    padding: 18px;

    display: grid;
    grid-template-columns: 54px 1fr;
    gap: 14px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 24px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);
    backdrop-filter: blur(14px);

    @media (max-width: 920px) {
        position: static;
    }
`;

export const SellerAvatar = styled.div`
    width: 54px;
    height: 54px;

    display: grid;
    place-items: center;

    color: #ffffff;
    background: linear-gradient(
            135deg,
            var(--primary, #3f6f58),
            var(--primary-dark, #2d4f3f)
    );
    border-radius: 18px;

    font-size: 20px;
    font-weight: 950;
`;

export const SellerInfo = styled.div`
    min-width: 0;

    span {
        color: var(--muted, #6f7a73);
        font-size: 12px;
        font-weight: 800;
    }

    strong {
        margin-top: 3px;

        display: block;

        color: var(--text, #1f2a24);

        font-size: 17px;
        font-weight: 950;
    }

    p {
        margin-top: 4px;

        color: var(--muted, #6f7a73);

        font-size: 13px;
        font-weight: 700;
    }
`;

export const ContactButton = styled.button`
    grid-column: 1 / -1;
    height: 48px;
    margin-top: 4px;

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

export const DescriptionCard = styled.article`
    padding: 26px;

    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 24px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

    h2 {
        margin-top: 10px;

        color: var(--text, #1f2a24);

        font-size: 28px;
        line-height: 1.15;
        letter-spacing: -0.04em;
        font-weight: 950;
    }

    p {
        margin-top: 18px;

        color: var(--text, #1f2a24);

        font-size: 16px;
        line-height: 1.75;
        font-weight: 600;
        white-space: pre-line;
    }
`;

export const Badge = styled.span`
    width: fit-content;
    padding: 7px 11px;

    display: inline-flex;

    color: var(--primary-dark, #2d4f3f);
    background: var(--accent-soft, #fff1cc);
    border-radius: 999px;

    font-size: 12px;
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

export const ErrorText = styled.div`
    padding: 34px;

    color: var(--danger, #d45b5b);
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(212, 91, 91, 0.28);
    border-radius: 24px;

    font-size: 16px;
    font-weight: 900;
    text-align: center;
`;

export const BackButton = styled.button`
    height: 46px;
    margin: 16px auto 0;
    padding: 0 20px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #ffffff;
    background: var(--primary, #3f6f58);
    border: 0;
    border-radius: 14px;

    font-size: 14px;
    font-weight: 900;

    cursor: pointer;
`;

export const ActionButton = styled.button`
    height: 48px;
    padding: 0 18px;

    color: #ffffff;
    background: var(--primary, #3f6f58);
    border: 0;
    border-radius: 16px;

    font-size: 14px;
    font-weight: 900;

    cursor: pointer;
`;