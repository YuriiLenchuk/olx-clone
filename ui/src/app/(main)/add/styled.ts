'use client';

import styled from 'styled-components';

export const Page = styled.main`
  min-height: 100vh;

  background:
    radial-gradient(circle at 8% 10%, rgba(242, 189, 87, 0.24), transparent 28%),
    radial-gradient(circle at 90% 12%, rgba(63, 111, 88, 0.14), transparent 30%),
    var(--bg, #f7f4ee);
`;

export const PageContainer = styled.div`
  width: min(1040px, calc(100% - 48px));
  margin: 0 auto;
  padding: 42px 0 80px;

  @media (max-width: 680px) {
    width: min(100% - 28px, 1040px);
    padding: 26px 0 56px;
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

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
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

export const TextInput = styled.input`
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

export const Select = styled.select`
  width: 100%;
  height: 50px;
  padding: 0 15px;

  color: var(--text, #1f2a24);
  background: #fbfaf7;
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 16px;
  outline: none;

  font-size: 15px;
  font-weight: 800;

  cursor: pointer;
  transition: 0.16s ease;

  &:hover {
    border-color: rgba(63, 111, 88, 0.32);
  }

  &:focus {
    background: #ffffff;
    border-color: rgba(63, 111, 88, 0.58);
    box-shadow: 0 0 0 4px rgba(63, 111, 88, 0.11);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 160px;
  padding: 15px;

  resize: vertical;

  color: var(--text, #1f2a24);
  background: #fbfaf7;
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 18px;
  outline: none;

  font-size: 15px;
  line-height: 1.55;
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

export const RadioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const RadioCard = styled.button<{ $active: boolean }>`
  min-height: 72px;
  padding: 13px 14px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;

  text-align: left;

  background: ${({ $active }) => ($active ? 'var(--accent-soft, #fff1cc)' : '#fbfaf7')};
  border: 1px solid
    ${({ $active }) => ($active ? 'rgba(242, 189, 87, 0.75)' : 'var(--border, #e8e1d6)')};
  border-radius: 18px;

  cursor: pointer;
  transition: 0.16s ease;

  strong {
    color: var(--text, #1f2a24);
    font-size: 15px;
    font-weight: 950;
  }

  span {
    color: var(--muted, #6f7a73);
    font-size: 13px;
    line-height: 1.35;
    font-weight: 700;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(63, 111, 88, 0.28);
    box-shadow: 0 12px 26px rgba(35, 45, 39, 0.06);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const UploadBox = styled.label`
  min-height: 150px;
  padding: 24px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  text-align: center;

  color: var(--text, #1f2a24);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 241, 204, 0.42)),
    #fbfaf7;
  border: 1.5px dashed rgba(63, 111, 88, 0.36);
  border-radius: 22px;

  cursor: pointer;
  transition: 0.16s ease;

  input {
    display: none;
  }

  strong {
    font-size: 16px;
    font-weight: 950;
  }

  span {
    color: var(--muted, #6f7a73);
    font-size: 14px;
    font-weight: 700;
  }

  &:hover {
    transform: translateY(-2px);
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.86), rgba(255, 241, 204, 0.58)),
      #ffffff;
    border-color: rgba(63, 111, 88, 0.58);
    box-shadow: 0 16px 34px rgba(35, 45, 39, 0.08);
  }
`;

export const HelpText = styled.p`
  margin-top: 2px;

  color: var(--muted, #6f7a73);
  font-size: 13px;
  line-height: 1.45;
  font-weight: 700;
`;

export const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const FileCard = styled.div`
  position: relative;
  overflow: hidden;

  min-height: 150px;

  background: #f8f5ef;
  border: 1px solid var(--border, #e8e1d6);
  border-radius: 20px;

  button {
    position: absolute;
    right: 8px;
    bottom: 8px;

    min-height: 34px;
    padding: 0 12px;

    color: #ffffff;
    background: rgba(31, 42, 36, 0.78);
    border: 0;
    border-radius: 999px;

    font-size: 12px;
    font-weight: 900;

    cursor: pointer;
    transition: 0.16s ease;

    &:hover {
      background: var(--danger, #d45b5b);
    }
  }
`;

export const ImagePreview = styled.img`
  width: 100%;
  height: 150px;

  display: block;

  object-fit: cover;
`;

export const Actions = styled.div`
  padding-top: 8px;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column-reverse;
  }
`;

export const PrimaryButton = styled.button`
  min-height: 50px;
  padding: 0 22px;

  color: #ffffff;
  background: var(--primary, #3f6f58);
  border: 0;
  border-radius: 999px;
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

export const ErrorMessage = styled.div`
  padding: 14px 16px;

  color: var(--danger, #d45b5b);
  background: #fff5f5;
  border: 1px solid rgba(212, 91, 91, 0.22);
  border-radius: 16px;

  font-size: 14px;
  line-height: 1.45;
  font-weight: 900;
`;

export const SubmitMessage = styled.div`
  padding: 14px 16px;

  color: var(--primary-dark, #2d4f3f);
  background: rgba(220, 239, 227, 0.75);
  border: 1px solid rgba(63, 111, 88, 0.22);
  border-radius: 16px;

  font-size: 14px;
  line-height: 1.45;
  font-weight: 900;
`;