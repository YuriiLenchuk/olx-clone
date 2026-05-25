'use client';

import styled from 'styled-components';

export const StyledCategories = styled.article`
    max-width: 1180px;
    margin: 0 auto;
    padding: 46px 24px 70px;

    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        margin-bottom: 14px;

        color: var(--text);
        font-size: 38px;
        line-height: 1.1;
        font-weight: 900;
        letter-spacing: -0.04em;
        text-align: center;
    }
`;

export const StyledCategoriesList = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: repeat(auto-fill, 136px);
    justify-content: center;
    align-items: stretch;
    gap: 16px;

    @media (max-width: 520px) {
        grid-template-columns: repeat(2, 136px);
    }

    @media (max-width: 340px) {
        grid-template-columns: 136px;
    }
`;