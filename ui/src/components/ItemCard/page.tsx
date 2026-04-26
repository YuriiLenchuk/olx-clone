"use client";

import { Item } from "@/services/CategoryService";
import {
    StyledCard,
    StyledProductDescription,
    StyledProductImg,
    StyledProductImgDiv, StyledProductLike,
    StyledProductName, StyledProductPrice,
    StyledProductTitle, StyledProductWrapper
} from "./styled"
import Link from "next/link";
import date from "@/Utils/DateStr"
import Like from "@/icons/Like";
import {useState} from "react";
import Cookies from "js-cookie"
import {json} from "node:stream/consumers";

export default function ItemCard({item, checked}: { item: Item, checked?: boolean }) {
    const [selected, setSelected] = useState<boolean | undefined>(checked);
    function setCookies() {
        const checkedCookie = Cookies.get("checked");
        const checkedArray = checkedCookie ? JSON.parse(checkedCookie) : [];
        if (!checkedArray.includes(item._id.toString())) {
            checkedArray.push(item._id.toString());
        }
        return JSON.stringify(checkedArray);
    }
    function removeFromCookieArray(key: string, id: string) {
        const cookie = Cookies.get(key);
        if (!cookie) return;
        Cookies.set(key, JSON.stringify(JSON.parse(cookie).filter((item: string) => item !== id)));
    }
    function onClick (): void {
        selected ? removeFromCookieArray("checked", item._id) : Cookies.set('checked', setCookies());
        setSelected(prevState => !prevState);
    }
    return (
        <StyledCard>
            <Link href={`obyava/${item._id}`} style={{display: "flex", width: "100%"}}>
                <StyledProductImgDiv>
                    <StyledProductImg src={`http://localhost:3005/img/${item.img[0]}`} alt={item.name}/>
                </StyledProductImgDiv>
                <StyledProductTitle>
                    <StyledProductWrapper>
                        <StyledProductName>{item.name}</StyledProductName>
                        <StyledProductPrice>{item.price} грн.</StyledProductPrice>
                    </StyledProductWrapper>
                    <StyledProductWrapper>
                        <StyledProductDescription>{item.location} - {date(item.date)}</StyledProductDescription>
                    </StyledProductWrapper>
                </StyledProductTitle>
            </Link>
            <StyledProductLike onClick={() => onClick()}>
                <span>{selected ? "Відписатися" : "Підписатися"}</span>
                <Like width={20} height={20} color={'#406367'} checked={selected} />
            </StyledProductLike>
        </StyledCard>
    )
}