'use client';

import Link from 'next/link';
import styled from 'styled-components';

export const Panel = styled.div`
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  z-index: 20;

  width: 320px;
  max-width: calc(100vw - 32px);
  padding: 14px;

  transform: translateX(-50%);

  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: 0 22px 55px rgba(35, 45, 39, 0.18);
  backdrop-filter: blur(14px);

  animation: panelFade 0.18s ease;

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;

    width: 16px;
    height: 16px;

    transform: translateX(-50%) rotate(45deg);

    background: rgba(255, 255, 255, 0.96);
    border-left: 1px solid var(--border);
    border-top: 1px solid var(--border);
  }

  @keyframes panelFade {
    from {
      opacity: 0;
      margin-top: -6px;
    }

    to {
      opacity: 1;
      margin-top: 0;
    }
  }

  @media (max-width: 560px) {
    width: 280px;
  }
`;

export const PanelHeader = styled.div`
  position: relative;
  z-index: 1;

  padding: 4px 6px 12px;
  margin-bottom: 8px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  border-bottom: 1px solid var(--border);
`;

export const PanelTitle = styled.h4`
  color: var(--text);
  font-size: 16px;
  line-height: 1.2;
  font-weight: 900;
`;

export const PanelCount = styled.span`
  flex-shrink: 0;

  padding: 5px 9px;

  color: var(--primary-dark);
  background: var(--accent-soft);
  border-radius: 999px;

  font-size: 12px;
  font-weight: 800;
`;

export const SubcategoryList = styled.ul`
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  gap: 6px;

  list-style: none;
`;

export const SubcategoryLink = styled(Link)`
  min-height: 42px;
  padding: 10px 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  color: var(--text);
  background: transparent;
  border-radius: 14px;

  font-size: 14px;
  font-weight: 700;

  transition: 0.16s ease;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  b {
    color: var(--primary);
    font-size: 20px;
    line-height: 1;
    transition: 0.16s ease;
  }

  &:hover {
    color: var(--primary-dark);
    background: #f5f1e8;
  }

  &:hover b {
    transform: translateX(3px);
  }
`;

export const EmptyText = styled.p`
  position: relative;
  z-index: 1;

  padding: 14px 10px 8px;

  color: var(--muted);
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
`;