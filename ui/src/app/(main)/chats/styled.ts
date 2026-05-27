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
  width: min(920px, calc(100% - 48px));
  margin: 0 auto;
  padding: 38px 0 80px;
`;

export const PageHeader = styled.section`
  margin-bottom: 22px;
  padding: 24px;

  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 26px;
  box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);
`;

export const PageTitle = styled.h1`
  color: var(--text, #1f2a24);
  font-size: clamp(34px, 4vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.05em;
  font-weight: 950;
`;

export const PageDescription = styled.p`
  margin-top: 10px;
  color: var(--muted, #6f7a73);
  font-size: 16px;
  line-height: 1.6;
  font-weight: 700;
`;

export const ChatList = styled.div`
  display: grid;
  gap: 12px;
`;

export const ChatCard = styled.button`
  width: 100%;
  padding: 14px;

  display: grid;
  grid-template-columns: 86px 1fr;
  gap: 14px;
  align-items: center;

  text-align: left;

  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 22px;
  box-shadow: 0 14px 32px rgba(35, 45, 39, 0.07);

  cursor: pointer;
  transition: 0.16s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(63, 111, 88, 0.32);
    box-shadow: 0 18px 42px rgba(35, 45, 39, 0.1);
  }

  @media (max-width: 520px) {
    grid-template-columns: 68px 1fr;
  }
`;

export const ItemImage = styled.img`
  width: 86px;
  height: 86px;

  display: grid;
  place-items: center;

  object-fit: cover;

  color: var(--muted, #6f7a73);
  background: #f5f1e8;
  border-radius: 18px;

  font-size: 12px;
  font-weight: 900;

  @media (max-width: 520px) {
    width: 68px;
    height: 68px;
  }
`;

export const ChatInfo = styled.div`
  min-width: 0;

  strong {
    margin-top: 4px;
    display: block;

    color: var(--text, #1f2a24);
    font-size: 15px;
    font-weight: 950;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const UserName = styled.div`
  color: var(--primary-dark, #2d4f3f);
  font-size: 16px;
  font-weight: 950;
`;

export const LastMessage = styled.p`
  margin-top: 6px;

  color: var(--muted, #6f7a73);
  font-size: 14px;
  font-weight: 700;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmptyState = styled.div`
  padding: 32px;

  color: var(--muted, #6f7a73);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 24px;
  box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

  font-size: 16px;
  font-weight: 900;
  text-align: center;
`;