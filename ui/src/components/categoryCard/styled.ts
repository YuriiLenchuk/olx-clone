'use client'

import styled from "styled-components";

export const StyledCategoryCard = styled.div<{ color: string }>`
    text-align: center;
    margin-bottom: 40px;
    padding: 0 6px;
    img{
        border-radius: 50%;
        background-color: ${({color})=> color};
    }
    p{
        font-size: 16px;
        line-height: 20px;
        font-weight: 700;
        margin-top: 28px;
    }
`