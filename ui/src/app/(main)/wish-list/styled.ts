'use client';

import styled, {keyframes} from 'styled-components';

export const Page = styled.main`
  min-height: 100vh;

  background:
    radial-gradient(circle at 8% 10%, rgba(242, 189, 87, 0.26), transparent 28%),
    radial-gradient(circle at 90% 12%, rgba(63, 111, 88, 0.14), transparent 30%),
    var(--bg, #f7f4ee);
`;

export const PageContainer = styled.div`
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 40px 0 80px;

  @media (max-width: 680px) {
    width: min(100% - 28px, 1180px);
    padding: 26px 0 56px;
  }
`;

export const PageHeader = styled.section`
  margin-bottom: 24px;
  padding: 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 24px;
  box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);
  backdrop-filter: blur(14px);

  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const PageTitle = styled.h1`
  color: var(--text, #1f2a24);

  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.05;
  letter-spacing: -0.05em;
  font-weight: 950;
`;

export const PageDescription = styled.p`
  max-width: 560px;
  margin-top: 10px;

  color: var(--muted, #6f7a73);

  font-size: 16px;
  line-height: 1.55;
  font-weight: 600;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const StatsBadge = styled.span`
  min-height: 42px;
  padding: 0 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: var(--primary-dark, #2d4f3f);
  background: var(--accent-soft, #fff1cc);
  border: 1px solid rgba(242, 189, 87, 0.35);
  border-radius: 999px;

  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
`;

export const ActionButton = styled.button`
  min-height: 42px;
  padding: 0 16px;

  color: #ffffff;
  background: var(--primary, #3f6f58);
  border: 0;
  border-radius: 999px;

  font-size: 14px;
  font-weight: 900;

  cursor: pointer;
  transition: 0.16s ease;

  &:hover {
    transform: translateY(-2px);
    background: var(--primary-dark, #2d4f3f);
    box-shadow: 0 14px 30px rgba(63, 111, 88, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const EmptyCard = styled.section`
  min-height: 360px;
  padding: 44px 24px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 26px;
  box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

  h2 {
    margin-top: 14px;

    color: var(--text, #1f2a24);
    font-size: 28px;
    line-height: 1.15;
    letter-spacing: -0.04em;
    font-weight: 950;
  }

  p {
    max-width: 440px;
    margin-top: 12px;

    color: var(--muted, #6f7a73);
    font-size: 15px;
    line-height: 1.6;
    font-weight: 600;
  }

  a {
    min-height: 46px;
    margin-top: 22px;
    padding: 0 20px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    color: #ffffff;
    background: var(--primary, #3f6f58);
    border-radius: 999px;

    font-size: 14px;
    font-weight: 900;
    text-decoration: none;

    transition: 0.16s ease;

    &:hover {
      transform: translateY(-2px);
      background: var(--primary-dark, #2d4f3f);
      box-shadow: 0 14px 30px rgba(63, 111, 88, 0.2);
    }
  }
`;

export const EmptyIcon = styled.div`
  width: 76px;
  height: 76px;

  display: grid;
  place-items: center;

  color: var(--primary-dark, #2d4f3f);
  background: var(--accent-soft, #fff1cc);
  border-radius: 24px;

  font-size: 42px;
  line-height: 1;
  font-weight: 900;
`;

export const LoadingCard = styled.div`
  padding: 40px;

  color: var(--muted, #6f7a73);
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 24px;
  box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

  font-size: 16px;
  font-weight: 900;
  text-align: center;
`;

export const ErrorCard = styled.div`
  padding: 34px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  color: var(--danger, #d45b5b);
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(212, 91, 91, 0.28);
  border-radius: 24px;
  box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

  font-size: 16px;
  text-align: center;
`;

const skeletonPulse = keyframes`
    0% {
        opacity: 0.55;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.55;
    }
`;

export const ContentFade = styled.div`
    animation: fadeIn 240ms ease-out both;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

export const SkeletonBlock = styled.div<{
    $width?: string;
    $height?: string;
    $radius?: string;
}>`
    width: ${({ $width }) => $width || '100%'};
    height: ${({ $height }) => $height || '16px'};

    background: linear-gradient(
        90deg,
        rgba(232, 225, 214, 0.65),
        rgba(248, 245, 239, 0.95),
        rgba(232, 225, 214, 0.65)
    );
    border-radius: ${({ $radius }) => $radius || '999px'};

    animation: ${skeletonPulse} 1.15s ease-in-out infinite;
`;

export const WishlistSkeletonCard = styled.article`
    padding: 14px;

    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 18px;

    background: rgba(255, 255, 255, 0.88);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 24px;
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

    @media (max-width: 680px) {
        grid-template-columns: 1fr;
    }
`;

export const WishlistSkeletonInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
`;