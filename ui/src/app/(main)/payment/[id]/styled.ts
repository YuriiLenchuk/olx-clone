'use client';

import styled from 'styled-components';

export type PaymentStatus = 'idle' | 'loading' | 'success' | 'error';

export const Page = styled.main`
  min-height: 100vh;
  background:
    radial-gradient(circle at 8% 8%, rgba(242, 189, 87, 0.24), transparent 28%),
    radial-gradient(circle at 92% 12%, rgba(63, 111, 88, 0.14), transparent 30%),
    var(--bg, #f7f4ee);
`;

export const PageContainer = styled.div`
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: 34px 0 80px;

  @media (max-width: 680px) {
    width: min(100% - 28px, 1120px);
    padding: 22px 0 54px;
  }
`;

export const PageHeader = styled.section`
  margin-bottom: 24px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 26px;
  box-shadow: 0 18px 42px rgba(35, 45, 39, 0.08);
  backdrop-filter: blur(14px);

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const PageTitle = styled.h1`
  color: var(--text, #1f2a24);
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.05em;
  font-weight: 950;
`;

export const PageDescription = styled.p`
  max-width: 620px;
  margin-top: 10px;
  color: var(--muted, #6f7a73);
  font-size: 16px;
  line-height: 1.6;
  font-weight: 600;
`;

export const CheckoutGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
  gap: 22px;
  align-items: start;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const FormCard = styled.section`
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

export const OrderCard = styled.aside`
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

export const GooglePayBadge = styled.div`
  width: fit-content;
  margin-bottom: 18px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-dark, #2d4f3f);
  background: var(--accent-soft, #fff1cc);
  border: 1px solid rgba(242, 189, 87, 0.35);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;

  span {
    color: var(--text, #1f2a24);
    font-weight: 950;
  }

  strong {
    color: var(--muted, #6f7a73);
    font-weight: 900;
  }
`;

export const SecureBox = styled.div`
  margin-bottom: 20px;
  padding: 18px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(255, 241, 204, 0.42)),
    #fbfaf7;
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 20px;

  strong {
    display: block;
    color: var(--text, #1f2a24);
    font-size: 18px;
    line-height: 1.25;
    font-weight: 950;
  }

  p {
    margin-top: 8px;
    color: var(--muted, #6f7a73);
    font-size: 14px;
    line-height: 1.55;
    font-weight: 700;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;

  label {
    color: var(--text, #1f2a24);
    font-size: 14px;
    line-height: 1.25;
    font-weight: 900;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 15px;
  color: var(--text, #1f2a24);
  background: #fbfaf7;
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 16px;
  outline: none;
  font-size: 15px;
  font-weight: 700;
  transition: 0.16s ease;

  &::placeholder {
    color: #a19a8e;
  }

  &:hover {
    border-color: rgba(63, 111, 88, 0.32);
  }

  &:focus {
    background: #ffffff;
    border-color: rgba(63, 111, 88, 0.58);
    box-shadow: 0 0 0 4px rgba(63, 111, 88, 0.11);
  }
`;

export const HelpText = styled.p`
  margin-top: 2px;
  color: var(--muted, #6f7a73);
  font-size: 13px;
  line-height: 1.45;
  font-weight: 700;
`;

export const ThreeDSCard = styled.div`
  margin-top: 18px;
  padding: 18px;
  background: #fffaf0;
  border: 1px solid rgba(242, 189, 87, 0.42);
  border-radius: 20px;
`;

export const Actions = styled.div`
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column-reverse;
  }
`;

export const PayButton = styled.button`
  min-height: 50px;
  padding: 0 24px;
  color: #ffffff;
  background: var(--primary, #3f6f58);
  border: 0;
  border-radius: 999px;
  box-shadow: 0 14px 30px rgba(63, 111, 88, 0.24);
  font-size: 15px;
  font-weight: 950;
  cursor: pointer;
  transition: 0.16s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: var(--primary-dark, #2d4f3f);
  }

  &:active:not(:disabled) {
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

export const BackButton = styled.button`
  min-height: 44px;
  padding: 0 18px;
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

  @media (max-width: 560px) {
    width: 100%;
  }
`;

export const ConfirmButton = styled(PayButton)`
  width: 100%;
  margin-top: 14px;
  border-radius: 16px;
`;

export const StatusMessage = styled.div<{
    $status: PaymentStatus;
}>`
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 900;

  color: ${({ $status }) => {
    if ($status === 'success') return 'var(--primary-dark, #2d4f3f)';
    if ($status === 'error') return 'var(--danger, #d45b5b)';
    if ($status === 'loading') return '#2d4f3f';

    return 'var(--text, #1f2a24)';
}};

  background: ${({ $status }) => {
    if ($status === 'success') return 'rgba(220, 239, 227, 0.75)';
    if ($status === 'error') return '#fff5f5';
    if ($status === 'loading') return '#f8f5ef';

    return '#f8f5ef';
}};

  border: 1px solid
    ${({ $status }) => {
    if ($status === 'success') return 'rgba(63, 111, 88, 0.22)';
    if ($status === 'error') return 'rgba(212, 91, 91, 0.22)';

    return 'var(--border, #e8e1d6)';
}};
`;

export const ErrorMessage = styled.div`
  margin-bottom: 18px;
  padding: 14px 16px;
  color: var(--danger, #d45b5b);
  background: #fff5f5;
  border: 1px solid rgba(212, 91, 91, 0.22);
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.45;
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

export const SummaryTitle = styled.h2`
  margin-bottom: 16px;
  color: var(--text, #1f2a24);
  font-size: 24px;
  line-height: 1.15;
  letter-spacing: -0.04em;
  font-weight: 950;
`;

export const ImageBox = styled.div`
  width: 100%;
  height: 220px;
  margin-bottom: 16px;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: var(--muted, #6f7a73);
  background: #f5f1e8;
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 900;
`;

export const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
`;

export const ItemName = styled.h3`
  margin-bottom: 14px;
  color: var(--text, #1f2a24);
  font-size: 22px;
  line-height: 1.18;
  letter-spacing: -0.03em;
  font-weight: 950;
`;

export const ItemMeta = styled.div`
  margin-bottom: 10px;
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

export const SummaryRow = styled.div`
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--border, #e8e1d6);

  span {
    color: var(--muted, #6f7a73);
    font-size: 14px;
    font-weight: 800;
  }

  strong {
    color: var(--text, #1f2a24);
    font-size: 14px;
    font-weight: 950;
  }
`;

export const TotalRow = styled.div`
  padding-top: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  span {
    color: var(--text, #1f2a24);
    font-size: 15px;
    font-weight: 950;
  }
`;

export const Price = styled.strong`
  color: var(--primary-dark, #2d4f3f);
  font-size: 28px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.04em;
`;

export const CardBrand = styled.div`
  margin-top: 20px;
  padding: 14px;
  background: var(--accent-soft, #fff1cc);
  border: 1px solid rgba(242, 189, 87, 0.35);
  border-radius: 18px;

  span {
    display: block;
    color: var(--muted, #6f7a73);
    font-size: 12px;
    font-weight: 800;
  }

  strong {
    margin-top: 4px;
    display: block;
    color: var(--primary-dark, #2d4f3f);
    font-size: 15px;
    font-weight: 950;
  }
`;