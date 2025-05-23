'use client'

import styled from "styled-components";
import Link from 'next/link'

export const StyledHeader = styled.header`
    background-color: #002F34;
    height: 72px;
    padding: 0 105px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    
`
export const WrapperLink = styled(Link)`
    align-self: center;
    align-items: center;
    display: flex;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    svg{
        margin-right: 10px;
    }
    margin: 0 40px 0 0;
`

export const Button = styled.button`
    background-color: #ffffff;
    color: #002F34;
    border-radius: 4px;
    padding: 10px 30px 8px 30px;
    border: solid 5px #FFFFFF;
    font-weight: 700;
    font-size: 16px;
    &:hover {
        background-color: black;
        color: white;
        transition: 80ms;
    }
`
