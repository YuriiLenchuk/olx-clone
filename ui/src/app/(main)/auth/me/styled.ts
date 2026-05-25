'use client';

import styled from 'styled-components';

export const Page = styled.main`
  min-height: 100vh;

  background:
    radial-gradient(circle at 8% 10%, rgba(242, 189, 87, 0.26), transparent 28%),
    radial-gradient(circle at 90% 12%, rgba(63, 111, 88, 0.14), transparent 30%),
    var(--bg, #f7f4ee);
`;

export const PageContainer = styled.div`
  width: min(920px, calc(100% - 48px));
  margin: 0 auto;
  padding: 44px 0 80px;

  @media (max-width: 680px) {
    width: min(100% - 28px, 920px);
    padding: 26px 0 56px;
  }
`;

export const ProfileCard = styled.section`
  padding: 26px;

  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 28px;
  box-shadow: 0 22px 55px rgba(35, 45, 39, 0.1);
  backdrop-filter: blur(14px);

  @media (max-width: 560px) {
    padding: 18px;
    border-radius: 24px;
  }
`;

export const ProfileHeader = styled.div`
  display: grid;
  grid-template-columns: 76px 1fr auto;
  align-items: center;
  gap: 18px;

  padding-bottom: 22px;
  margin-bottom: 22px;

  border-bottom: 1px solid var(--border, #e8e1d6);

  @media (max-width: 640px) {
    grid-template-columns: 64px 1fr;
    align-items: start;
  }
`;

export const Avatar = styled.div`
  width: 76px;
  height: 76px;

  display: grid;
  place-items: center;
  flex-shrink: 0;

  color: #ffffff;
  background: linear-gradient(
    135deg,
    var(--primary, #3f6f58),
    var(--primary-dark, #2d4f3f)
  );
  border-radius: 24px;
  box-shadow: 0 14px 30px rgba(63, 111, 88, 0.24);

  font-size: 30px;
  line-height: 1;
  font-weight: 950;

  @media (max-width: 640px) {
    width: 64px;
    height: 64px;
    font-size: 25px;
    border-radius: 20px;
  }
`;

export const ProfileMeta = styled.div`
  min-width: 0;

  > span {
    display: inline-flex;
    margin-bottom: 7px;
    padding: 6px 10px;

    color: var(--primary-dark, #2d4f3f);
    background: var(--accent-soft, #fff1cc);
    border: 1px solid rgba(242, 189, 87, 0.32);
    border-radius: 999px;

    font-size: 12px;
    line-height: 1;
    font-weight: 900;
  }

  > p {
    margin-top: 5px;

    color: var(--muted, #6f7a73);
    font-size: 14px;
    line-height: 1.35;
    font-weight: 700;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ProfileName = styled.h1`
  color: var(--text, #1f2a24);

  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.05;
  letter-spacing: -0.05em;
  font-weight: 950;

  overflow-wrap: anywhere;
`;

export const LogoutButton = styled.button`
  min-height: 42px;
  padding: 0 16px;

  color: var(--danger, #d45b5b);
  background: #fff5f5;
  border: 1px solid rgba(212, 91, 91, 0.22);
  border-radius: 999px;

  font-size: 14px;
  font-weight: 900;

  cursor: pointer;
  transition: 0.16s ease;

  &:hover {
    transform: translateY(-2px);
    background: #ffecec;
    box-shadow: 0 12px 26px rgba(212, 91, 91, 0.12);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    grid-column: 1 / -1;
    width: 100%;
  }
`;

export const ProfileSection = styled.section`
  margin-top: 24px;
  padding-top: 24px;

  border-top: 1px solid var(--border, #e8e1d6);

  &:first-of-type {
    margin-top: 0;
    padding-top: 0;
    border-top: 0;
  }
`;

export const SectionHeader = styled.div`
  margin-bottom: 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const SectionTitle = styled.h2`
  color: var(--text, #1f2a24);
    
  font-size: 22px;
  line-height: 1.15;
  font-weight: 950;
  letter-spacing: -0.03em;
  min-height: 40px;
`;

export const SecondaryButton = styled.button`
  min-height: 40px;
  padding: 0 16px;

  color: var(--primary-dark, #2d4f3f);
  background: var(--accent-soft, #fff1cc);
  border: 1px solid rgba(242, 189, 87, 0.35);
  border-radius: 999px;

  font-size: 14px;
  font-weight: 900;

  cursor: pointer;
  transition: 0.16s ease;

  &:hover {
    transform: translateY(-2px);
    background: #ffe8a7;
    box-shadow: 0 12px 26px rgba(242, 189, 87, 0.18);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  padding: 14px;

  background: #f8f5ef;
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 18px;

  span {
    display: block;
    margin-bottom: 7px;

    color: var(--muted, #6f7a73);
    font-size: 13px;
    line-height: 1.25;
    font-weight: 800;
  }

  strong {
    color: var(--text, #1f2a24);
    font-size: 15px;
    line-height: 1.35;
    font-weight: 900;
    word-break: break-word;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: var(--text, #1f2a24);
    font-size: 13px;
    line-height: 1.25;
    font-weight: 900;
  }

  input {
    width: 100%;
    height: 48px;
    padding: 0 14px;

    color: var(--text, #1f2a24);
    background: #fbfaf7;
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 15px;
    outline: none;

    font-size: 14px;
    font-weight: 700;

    transition: 0.16s ease;

    &::placeholder {
      color: #a19a8e;
    }

    &:hover {
      border-color: rgba(63, 111, 88, 0.3);
    }

    &:focus {
      background: #ffffff;
      border-color: rgba(63, 111, 88, 0.58);
      box-shadow: 0 0 0 4px rgba(63, 111, 88, 0.11);
    }
  }
`;

export const FormActions = styled.div`
  margin-top: 16px;

  display: flex;
  justify-content: flex-end;

  @media (max-width: 560px) {
    justify-content: stretch;
  }
`;

export const SaveButton = styled.button`
  min-height: 46px;
  padding: 0 20px;

  color: #ffffff;
  background: var(--primary, #3f6f58);
  border: 0;
  border-radius: 999px;
  box-shadow: 0 14px 30px rgba(63, 111, 88, 0.24);

  font-size: 14px;
  font-weight: 900;

  cursor: pointer;
  transition: 0.16s ease;

  &:hover {
    transform: translateY(-2px);
    background: var(--primary-dark, #2d4f3f);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 560px) {
    width: 100%;
  }
`;

export const RatingBox = styled.div`
  padding: 20px;

  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: center;
  gap: 8px 14px;

  background: #f8f5ef;
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 20px;

  > strong {
    grid-row: span 2;

    width: 72px;
    height: 72px;

    display: grid;
    place-items: center;

    color: #ffffff;
    background: linear-gradient(
      135deg,
      var(--primary, #3f6f58),
      var(--primary-dark, #2d4f3f)
    );
    border-radius: 22px;
    box-shadow: 0 14px 30px rgba(63, 111, 88, 0.2);

    font-size: 28px;
    line-height: 1;
    font-weight: 950;
  }

  > span {
    align-self: end;

    color: var(--text, #1f2a24);
    font-size: 16px;
    line-height: 1.25;
    font-weight: 950;
  }

  > p {
    align-self: start;

    color: var(--muted, #6f7a73);
    font-size: 14px;
    line-height: 1.45;
    font-weight: 700;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;

    > strong {
      grid-row: auto;
    }
  }
`;

export const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ReviewCard = styled.article`
  padding: 16px;

  background: #f8f5ef;
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 18px;

  transition: 0.16s ease;

  &:hover {
    border-color: rgba(63, 111, 88, 0.24);
    box-shadow: 0 12px 26px rgba(35, 45, 39, 0.06);
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    margin-bottom: 8px;

    @media (max-width: 420px) {
      align-items: flex-start;
      flex-direction: column;
      gap: 4px;
    }
  }

  strong {
    color: var(--text, #1f2a24);
    font-size: 15px;
    line-height: 1.25;
    font-weight: 950;
  }

  span {
    flex-shrink: 0;

    padding: 5px 9px;

    color: var(--primary-dark, #2d4f3f);
    background: var(--accent-soft, #fff1cc);
    border-radius: 999px;

    font-size: 13px;
    line-height: 1;
    font-weight: 950;
  }

  p {
    color: var(--text, #1f2a24);
    font-size: 14px;
    line-height: 1.55;
    font-weight: 600;
    white-space: pre-line;
  }

  small {
    display: block;
    margin-top: 10px;

    color: var(--muted, #6f7a73);
    font-size: 13px;
    line-height: 1.4;
    font-weight: 700;

    b {
      color: var(--primary-dark, #2d4f3f);
      font-weight: 900;
    }
  }

  time {
    display: block;
    margin-top: 10px;

    color: var(--muted, #6f7a73);
    font-size: 12px;
    line-height: 1.25;
    font-weight: 800;
  }
`;

export const ActionButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 24px;

  color: #ffffff;
  background: var(--primary, #3f6f58);
  border: 0;
  border-radius: 18px;
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

export const EmptyState = styled.section`
  min-height: 340px;
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

  h1 {
    color: var(--text, #1f2a24);

    font-size: clamp(30px, 4vw, 42px);
    line-height: 1.1;
    letter-spacing: -0.05em;
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

export const ErrorCard = styled.div`
  padding: 34px;

  color: var(--danger, #d45b5b);
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(212, 91, 91, 0.28);
  border-radius: 24px;
  box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);

  font-size: 16px;
  font-weight: 900;
  text-align: center;
`;