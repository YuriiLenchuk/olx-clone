'use client';

import styled from 'styled-components';
import Link from 'next/link';

export const StyledHeader = styled.header`
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(247, 244, 238, 0.86);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
`;

export const HeaderInner = styled.div`
    max-width: 1180px;
    height: 76px;
    margin: 0 auto;
    padding: 0 24px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 720px) {
        height: auto;
        min-height: 76px;
        gap: 16px;
        flex-direction: column;
        align-items: stretch;
        padding: 16px;
    }
`;

export const BrandLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 12px;

    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--text);
`;

export const BrandMark = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;

  display: grid;
  place-items: center;

  color: #ffffff;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  box-shadow: 0 12px 28px rgba(63, 111, 88, 0.26);

  font-size: 15px;
  font-weight: 900;
  letter-spacing: -0.05em;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 720px) {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

export const WrapperLink = styled(Link)`
  padding: 10px 14px;
  border-radius: 999px;

  color: var(--muted);
  font-size: 14px;
  font-weight: 700;

  transition: 0.18s ease;

  &:hover {
    color: var(--text);
    background: var(--surface);
  }
`;

export const ActionButton = styled.button`
  border: 0;
  border-radius: 999px;
  padding: 12px 20px;

  color: var(--primary-dark);
  background: var(--accent);

  font-size: 15px;
  font-weight: 800;

  box-shadow: 0 12px 28px rgba(242, 189, 87, 0.32);
  transition: 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: #f5c86d;
  }

  &:active {
    transform: translateY(0);
  }
`;