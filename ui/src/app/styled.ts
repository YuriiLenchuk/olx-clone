'use client'

import styled from "styled-components";
import Link from 'next/link'

export const StyledNotFound = styled("div")`
    background-color: #fffbef;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: auto;
    *{
        box-sizing: border-box;
    }
`
export const StyledButton = styled("button")`
    width: 232px;
    height: 48px;
    border-radius: 4px;
    color: #ffffff;
    background: #002f34;
    margin: 8px 0;
    font-size: 16px;
`

export const StyledP = styled('p')`
    color: #406367;
`

export const StyledMain = styled("main")`
    display: flex;
    align-items: center;
    flex-flow: column;
`

export const StyledH3 = styled('h3')`
    height: 48px;
    margin: 0;
    font-size: 20px;
    font-weight: 500;
`