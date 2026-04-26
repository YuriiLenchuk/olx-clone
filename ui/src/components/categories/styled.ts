'use client'

import styled from "styled-components";

export const StyledCategories = styled.article`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 60px;
    padding: 60px 0;
    h2{
        margin-bottom: 56px;
        font-size: 32px;
        font-weight: 700;
    }
`

export const StyledCategoriesList = styled.div`
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-column-gap: 16px;
    width: 100%;
    align-items: stretch;
`
