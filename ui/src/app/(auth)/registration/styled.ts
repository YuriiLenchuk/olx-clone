"use client"

import styled from "styled-components";
import Link from "next/link";

export const WrapperFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 400px;
    width: 100%;
    height: auto;
    background: #fff;
    padding: 0 32px;
    border-radius: 4px;
    >div{
        width: 100%;
        display: flex;
        justify-content: center;
        height: 56px;
    }
`

export const FormButton = styled.button<{ $active: boolean }>`
    box-sizing: border-box;
    width: 50%;
    height: 100%;
    background: none;
    border: none;
    margin-top: 8px;
    padding-bottom: 1px;
    border-bottom: ${props => props.$active ? "3px solid black" : "0.1px solid black"};
    &:hover{
        box-sizing: border-box;
        padding-bottom: 0;
        border-bottom: 4px solid #002F34;
    }
`

export const WrapperForm = styled.form`
    margin: 16px 0 32px 0;
    display: flex;
    justify-content: center;
    height: auto;
    flex-direction: column;
    width: 100%;
`

export const WrapperInput = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 16px; !important;
    >label{
        font-size: 14px;
        margin-bottom: 8px;
    }
    >input{
        height: 48px;
        border: 2px solid transparent;
        color: #002F34;
        background: #F2F4F5;
        padding: 14px 16px;
        margin-bottom: 6px;
        border-radius: 4px;
        &:focus{
            outline: none;
            border: 1px solid transparent;;
            border-bottom: black 1px solid;
        }
    }
    >div{
        display: flex;
        flex-direction: column;
        >p{
            font-size: 12px;
        }
        >span{
            font-size: 12px;
            >span{
                font-size: 18px; !important;
                font-weight: 500;
            }
        }
    }
`

export const SubmitButton = styled.input`
    margin-top: 32px;
    border: 4px solid #002F34;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    height: 48px;
    letter-spacing: 0.7px;
    line-height: 20px;
    padding: 0 32px;
    text-align: center;
    white-space: nowrap;
    background: #002F34;
    color: #FFFFFF;
    &:hover{
        background: white;
        color: #002F34;
    }
`

export const ForgetPasswordInput = styled(Link)`
    font-weight: 600;
`