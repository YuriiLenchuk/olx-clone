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

  @media (max-width: 640px) {
    width: min(100% - 24px, 920px);
    padding: 24px 0 56px;
  }
`;

export const ChatShell = styled.section`
  min-height: 72vh;

  display: grid;
  grid-template-rows: auto minmax(420px, 1fr) auto;

  overflow: hidden;

  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 28px;
  box-shadow: 0 22px 55px rgba(35, 45, 39, 0.1);
`;

export const ChatHeader = styled.header`
  padding: 18px;

  display: flex;
  align-items: center;
  gap: 14px;

  border-bottom: 1px solid var(--border, #e8e1d6);
`;

export const BackButton = styled.button`
  min-height: 42px;
  padding: 0 16px;

  color: var(--primary-dark, #2d4f3f);
  background: var(--accent-soft, #fff1cc);
  border: 1px solid rgba(242, 189, 87, 0.35);
  border-radius: 999px;

  font-size: 14px;
  font-weight: 900;

  cursor: pointer;
`;

export const UserInfo = styled.div`
  min-width: 0;

  span {
    color: var(--muted, #6f7a73);
    font-size: 12px;
    font-weight: 800;
  }

  strong {
    display: block;
    margin-top: 3px;

    color: var(--text, #1f2a24);
    font-size: 18px;
    font-weight: 950;
  }

  p {
    margin-top: 3px;

    color: var(--muted, #6f7a73);
    font-size: 13px;
    font-weight: 700;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ChatBody = styled.div`
  min-height: 0;
  padding: 18px;

  overflow-y: auto;

  background:
    radial-gradient(circle at 10% 0%, rgba(242, 189, 87, 0.12), transparent 28%),
    #fbfaf7;
`;

export const MessagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MessageBubble = styled.div<{ $own?: boolean }>`
  max-width: min(72%, 520px);
  padding: 12px 14px;

  align-self: ${({ $own }) => ($own ? 'flex-end' : 'flex-start')};

  color: ${({ $own }) => ($own ? '#ffffff' : 'var(--text, #1f2a24)')};
  background: ${({ $own }) =>
    $own ? 'var(--primary, #3f6f58)' : '#ffffff'};
  border: 1px solid
    ${({ $own }) => ($own ? 'rgba(63, 111, 88, 0.18)' : 'var(--border, #e8e1d6)')};
  border-radius: ${({ $own }) =>
    $own ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  box-shadow: 0 10px 22px rgba(35, 45, 39, 0.06);

  p {
    font-size: 15px;
    line-height: 1.5;
    font-weight: 700;
    white-space: pre-line;
    word-break: break-word;
  }

  span {
    margin-top: 6px;

    display: block;

    color: ${({ $own }) => ($own ? 'rgba(255,255,255,0.78)' : 'var(--muted, #6f7a73)')};
    font-size: 11px;
    font-weight: 800;
    text-align: right;
  }

  @media (max-width: 640px) {
    max-width: 86%;
  }
`;

export const Form = styled.form`
  padding: 14px;

  display: grid;
  grid-template-columns: 1fr 132px;
  gap: 10px;

  border-top: 1px solid var(--border, #e8e1d6);

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Input = styled.input`
  height: 50px;
  padding: 0 16px;

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

export const SendButton = styled.button`
  height: 50px;
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

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    background: var(--primary-dark, #2d4f3f);
  }
`;

export const EmptyState = styled.div`
  padding: 28px;

  color: var(--muted, #6f7a73);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 20px;

  font-size: 15px;
  font-weight: 900;
  text-align: center;
`;