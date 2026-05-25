'use client';

import Link from 'next/link';
import styled, {css} from 'styled-components';

export const StyledCategoryWrapper = styled.div`
    position: relative;

    width: 136px;
    height: 176px;
`;

const categoryCardBase = css<{ $active?: boolean }>`
    width: 140px;
    height: 180px;
    padding: 16px 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;

    background: ${({$active}) => ($active ? 'var(--primary)' : '#ffffff')};
    color: ${({$active}) => ($active ? '#ffffff' : 'var(--text)')};

    border: 1px solid ${({$active}) => ($active ? 'var(--primary)' : 'var(--border)')};
    border-radius: 18px;

    cursor: pointer;
    transition: 0.18s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow);
    }

    &:active {
        transform: translateY(-1px);
    }
`;

interface StyledCategoryButtonProps {
    $active?: boolean
}

export const StyledCategoryButton: StyledCategoryButtonProps = styled.button`
    ${categoryCardBase}
`;

export const StyledCategoryLink = styled(Link)`
    ${categoryCardBase}

    text-decoration: none;
`;

export const StyledCategoryIcon = styled.div<{
    $color: string;
}>`
    width: 78px;
    height: 78px;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;
    border-radius: 22px;

    img {
        width: 66px;
        height: 66px;
        object-fit: contain;
    }
`;

export const StyledCategoryName = styled.p`
    height: 50px;
    max-width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    color: inherit;

    font-size: 14px;
    line-height: 1.25;
    font-weight: 800;
    text-align: center;

    overflow: hidden;
`;