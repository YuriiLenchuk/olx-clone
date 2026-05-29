'use client';

import styled, { keyframes } from 'styled-components';

const pageFadeIn = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`;

export const TransitionSlot = styled.div<{ $variant?: 'main' | 'auth' }>`
    width: 100%;

    animation: ${pageFadeIn}
    ${({ $variant }) => ($variant === 'auth' ? '540ms' : '340ms')}
    cubic-bezier(0.22, 1, 0.36, 1)
    both;

    will-change: opacity;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;