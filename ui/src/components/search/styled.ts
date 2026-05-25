'use client';

import styled from 'styled-components';

export const StyledSearch = styled.section`
    width: 100%;
    padding: 74px 24px 54px;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 34px;

    background:
            radial-gradient(circle at 12% 18%, rgba(242, 189, 87, 0.42), transparent 30%),
            radial-gradient(circle at 86% 20%, rgba(63, 111, 88, 0.18), transparent 28%),
            linear-gradient(135deg, #fbf4e4 0%, #edf4ee 100%);
    border-bottom: 1px solid var(--border);

    @media (max-width: 720px) {
        padding: 46px 16px 34px;
    }
`;

export const HeroContent = styled.div`
    max-width: 780px;
    text-align: center;

    h1 {
        margin-top: 14px;
        font-size: clamp(34px, 5vw, 58px);
        line-height: 1.02;
        letter-spacing: -0.06em;
        color: var(--text);
    }

    p {
        max-width: 620px;
        margin: 18px auto 0;

        color: var(--muted);
        font-size: 18px;
        line-height: 1.6;
    }
`;

export const SearchHint = styled.span`
    display: inline-flex;
    padding: 8px 14px;
    border-radius: 999px;

    color: var(--primary-dark);
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(63, 111, 88, 0.14);

    font-size: 14px;
    font-weight: 800;
`;

export const StyledSearchForm = styled.form`
    width: min(920px, 100%);
    padding: 10px;

    display: flex;
    gap: 10px;

    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(63, 111, 88, 0.12);
    border-radius: 24px;
    box-shadow: var(--shadow);

    @media (max-width: 720px) {
        flex-direction: column;
        border-radius: 20px;
    }
`;

export const StyledSearchInput = styled.input`
  width: 100%;
  height: 58px;
  padding: 0 18px;

  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  outline: none;

  font-size: 16px;

  &::placeholder {
    color: #9a9488;
  }

  &:focus {
    border-color: rgba(63, 111, 88, 0.55);
    box-shadow: 0 0 0 4px rgba(63, 111, 88, 0.12);
  }
`;

export const StyledSearchButton = styled.button`
  min-width: 150px;
  height: 58px;
  padding: 0 24px;

  color: #ffffff;
  background: var(--primary);
  border: 0;
  border-radius: 18px;

  font-size: 16px;
  font-weight: 800;

  transition: 0.18s ease;

  &:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
`;