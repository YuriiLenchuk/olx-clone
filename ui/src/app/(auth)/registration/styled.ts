'use client';

import styled, {keyframes} from 'styled-components';
import Link from 'next/link';

export const Wrapper = styled.div`
    background:
            radial-gradient(circle at 12% 18%, rgba(242, 189, 87, 0.42), transparent 30%),
            radial-gradient(circle at 86% 20%, rgba(63, 111, 88, 0.18), transparent 28%),
            linear-gradient(135deg, #fbf4e4 0%, #edf4ee 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
`

export const WrapperFormContainer = styled.div`
    width: min(440px, calc(100% - 32px));
    margin: 54px auto 80px;
    padding: 18px 28px 30px;

    display: flex;
    flex-direction: column;
    align-items: center;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border, #e8e1d6);
    border-radius: 24px;
    box-shadow: 0 22px 55px rgba(35, 45, 39, 0.12);
    backdrop-filter: blur(14px);

    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -90px;
        right: -90px;

        width: 180px;
        height: 180px;

        background: radial-gradient(
                circle,
                rgba(242, 189, 87, 0.45),
                transparent 68%
        );
        pointer-events: none;
    }

    &::after {
        content: '';
        position: absolute;
        left: -80px;
        bottom: -80px;

        width: 170px;
        height: 170px;

        background: radial-gradient(
                circle,
                rgba(63, 111, 88, 0.16),
                transparent 68%
        );
        pointer-events: none;
    }

    > div {
        position: relative;
        z-index: 1;

        width: 100%;
        min-height: 54px;
        padding: 5px;

        display: flex;
        justify-content: center;
        gap: 6px;

        background: #f6f2ea;
        border: 1px solid var(--border, #e8e1d6);
        border-radius: 18px;
    }

    @media (max-width: 520px) {
        margin-top: 28px;
        padding: 16px 18px 24px;
        border-radius: 22px;
    }
`;

export const FormButton = styled.button<{ $active: boolean }>`
    width: 50%;
    min-height: 44px;
    padding: 0 12px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${({ $active }) =>
            $active ? 'var(--primary-dark, #2d4f3f)' : 'var(--muted, #6f7a73)'};
    background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
    border: 0;
    border-radius: 14px;
    box-shadow: ${({ $active }) =>
            $active ? '0 10px 24px rgba(35, 45, 39, 0.08)' : 'none'};

    cursor: pointer;

    font-size: 14px;
    font-weight: 900;
    line-height: 1.2;

    transition: 0.16s ease;

    &:hover {
        color: var(--primary-dark, #2d4f3f);
        background: ${({ $active }) => ($active ? '#ffffff' : 'rgba(255, 255, 255, 0.6)')};
    }

    &:active {
        transform: translateY(1px);
    }
`;

export const WrapperForm = styled.form`
    position: relative;
    z-index: 1;

    width: 100%;
    margin: 24px 0 0;

    display: flex;
    flex-direction: column;
`;

export const WrapperInput = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 17px;

    > label {
        margin-bottom: 8px;

        color: var(--text, #1f2a24);
        font-size: 14px;
        line-height: 1.25;
        font-weight: 800;
    }

    > input {
        width: 100%;
        height: 50px;
        padding: 0 15px;

        color: var(--text, #1f2a24);
        background: #fbfaf7;
        border: 1px solid var(--border, #e8e1d6);
        border-radius: 15px;
        outline: none;

        font-size: 15px;
        font-weight: 600;

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

    > div {
        margin-top: 6px;

        display: flex;
        flex-direction: column;
        gap: 4px;

        > p {
            color: var(--muted, #6f7a73);
            font-size: 12px;
            line-height: 1.45;
            font-weight: 600;
        }

        > span {
            color: var(--muted, #6f7a73);
            font-size: 12px;
            line-height: 1.45;
            font-weight: 600;

            > span {
                color: var(--primary-dark, #2d4f3f);
                font-size: 15px;
                font-weight: 900;
            }
        }
    }

    > span,
    > p {
        margin-top: 6px;

        color: var(--danger, #d45b5b);
        font-size: 12px;
        line-height: 1.35;
        font-weight: 800;
    }
`;

export const SubmitButton = styled.input`
    width: 100%;
    height: 52px;
    margin-top: 20px;
    padding: 0 24px;

    color: #ffffff;
    background: var(--primary, #3f6f58);
    border: 1px solid var(--primary, #3f6f58);
    border-radius: 16px;
    box-shadow: 0 14px 30px rgba(63, 111, 88, 0.24);

    cursor: pointer;

    font-size: 15px;
    font-weight: 900;
    letter-spacing: 0.02em;

    transition: 0.18s ease;

    &:hover {
        background: var(--primary-dark, #2d4f3f);
        border-color: var(--primary-dark, #2d4f3f);
        transform: translateY(-2px);
        box-shadow: 0 18px 36px rgba(63, 111, 88, 0.28);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const ForgetPasswordInput = styled(Link)`
    width: fit-content;
    margin: 2px 0 8px;

    color: var(--primary-dark, #2d4f3f);

    font-size: 14px;
    line-height: 1.35;
    font-weight: 900;

    transition: 0.16s ease;

    &:hover {
        color: var(--primary, #3f6f58);
        text-decoration: underline;
        text-underline-offset: 4px;
    }
`;

const panelFade = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`;

export const VariantPanel = styled.div`
    animation: ${panelFade} 340ms cubic-bezier(0.22, 1, 0.36, 1) both;
    width: min(440px, calc(100% - 32px));
    margin: 54px auto 80px;
    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;