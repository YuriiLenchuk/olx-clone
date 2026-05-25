'use client';

import {
    ActionButton,
    BrandLink,
    BrandMark,
    HeaderInner,
    Nav,
    StyledHeader,
    WrapperLink,
} from './styled';

export default function Header() {
    return (
        <StyledHeader>
            <HeaderInner>
                <BrandLink href="/home" aria-label="На головну">
                    <BrandMark>LM</BrandMark>
                    <span>Local Market</span>
                </BrandLink>

                <Nav>
                    <WrapperLink href="/wish-list">Збережене</WrapperLink>
                    <WrapperLink href="/registration">Профіль</WrapperLink>
                    <ActionButton type="button">+ Оголошення</ActionButton>
                </Nav>
            </HeaderInner>
        </StyledHeader>
    );
}