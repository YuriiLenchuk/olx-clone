'use client';

import Link from 'next/link';
import styled from 'styled-components';

const StyledCard = styled.article`
    position: relative;

    width: 100%;
    min-height: 172px;
    padding: 14px;

    display: flex;

    background: var(--surface);
    border: 1px solid var(--border, #e5ded2);
    border-radius: 22px;
    box-shadow: 0 14px 34px rgba(35, 45, 39, 0.08);

    transition: 0.18s ease;

    &:hover {
        transform: translateY(-3px);
        border-color: rgba(63, 111, 88, 0.28);
        box-shadow: 0 22px 48px rgba(35, 45, 39, 0.14);
    }

    @media (max-width: 680px) {
        min-height: auto;
        padding: 12px;
    }
`;

const StyledProductLink = styled(Link)`
    width: 100%;

    display: flex;
    gap: 18px;

    color: inherit;
    text-decoration: none;

    @media (max-width: 680px) {
        flex-direction: column;
        gap: 12px;
    }
`;

const StyledProductImgDiv = styled.div`
    width: 220px;
    height: 144px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    background: #f5f1e8;
    border-radius: 18px;

    @media (max-width: 680px) {
        width: 100%;
        height: 210px;
    }

    @media (max-width: 420px) {
        height: 180px;
    }
`;

const StyledProductImg = styled.img`
    width: 100%;
    height: 100%;

    object-fit: cover;

    transition: 0.2s ease;

    ${StyledCard}:hover & {
        transform: scale(1.04);
    }
`;

const StyledProductTitle = styled.div`
    min-width: 0;
    padding: 6px 120px 6px 0;

    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 14px;

    @media (max-width: 820px) {
        padding-right: 92px;
    }

    @media (max-width: 680px) {
        padding-right: 0;
    }
`;

const StyledProductWrapper = styled.div`
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StyledProductName = styled.h4`
    max-width: 100%;

    color: var(--text, #12211b);
    font-size: 19px;
    line-height: 1.25;
    font-weight: 850;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    transition: 0.16s ease;

    ${StyledCard}:hover & {
        color: var(--primary-dark, #2f5845);
    }
`;

const StyledProductPrice = styled.p`
    width: fit-content;
    padding: 7px 12px;

    color: var(--primary-dark, #2f5845);
    background: var(--accent-soft, #edf5ef);
    border-radius: 999px;

    font-size: 17px;
    line-height: 1.1;
    font-weight: 900;
`;

const StyledProductDescription = styled.p`
    color: var(--muted, #68756e);

    font-size: 13px;
    line-height: 1.35;
    font-weight: 700;
`;

const StyledProductLike = styled.button<{
    $selected?: boolean;
}>`
  position: absolute;
  right: 14px;
  bottom: 14px;
  z-index: 5;

  min-height: 42px;
  padding: 0 13px;

  display: flex;
  align-items: center;
  gap: 8px;

  color: var(--text, #12211b);
  background: #f8f5ef;
  border: 1px solid var(--border, #e5ded2);
  border-radius: 999px;

  cursor: pointer;
  transition: 0.16s ease;

  span {
    overflow: hidden;
    white-space: nowrap;

    display: none;
    color: inherit;

    font-size: 13px;
    font-weight: 800;

    transition: 0.16s ease;
  }

  &:hover {
    background: var(--accent-soft, #edf5ef);
    border-color: rgba(63, 111, 88, 0.32);
  }

  &:hover span {
    max-width: 90px;
    display: block;
  }

  @media (max-width: 680px) {
    right: 22px;
    bottom: 22px;
  }
`;

export {
    StyledCard,
    StyledProductLink,
    StyledProductImg,
    StyledProductImgDiv,
    StyledProductTitle,
    StyledProductName,
    StyledProductDescription,
    StyledProductPrice,
    StyledProductLike,
    StyledProductWrapper,
};