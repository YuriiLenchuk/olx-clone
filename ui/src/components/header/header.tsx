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
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
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
                    <ActionButton onClick={() => router.push('/add')} type="button">+ Оголошення</ActionButton>
                </Nav>
            </HeaderInner>
        </StyledHeader>
    );
}