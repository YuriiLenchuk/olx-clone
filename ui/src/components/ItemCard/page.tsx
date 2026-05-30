'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import FavoriteService from '@/services/FavoriteService';
import { getValidAuthToken } from '@/Utils/authToken';

import { Item } from '@/services/CategoryService';
import date from '@/Utils/DateStr';
import Like from '@/icons/Like';

import {
    StyledCard,
    StyledProductDescription,
    StyledProductImg,
    StyledProductImgDiv,
    StyledProductLike,
    StyledProductLink,
    StyledProductName,
    StyledProductPrice,
    StyledProductTitle,
    StyledProductWrapper,
} from './styled';

interface ItemCardProps {
    item: Item,
    checked?: boolean,
    onFavoriteChange?: (itemId: string, selected: boolean) => void,
}

export default function ItemCard({item, checked, onFavoriteChange,}: ItemCardProps) {
    const router = useRouter();
    const [selected, setSelected] = useState(Boolean(checked));
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setSelected(Boolean(checked));
    }, [checked]);

    async function onClick(): Promise<void> {
        if (isSaving) return;

        const token = getValidAuthToken();

        if (!token) {
            router.push('/registration');
            return;
        }

        try {
            setIsSaving(true);

            if (selected) {
                await FavoriteService.removeFavorite(token, item._id);
                setSelected(false);
                onFavoriteChange?.(item._id, false);
            } else {
                await FavoriteService.addFavorite(token, item._id);
                setSelected(true);
                onFavoriteChange?.(item._id, true);
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <StyledCard>
            <StyledProductLink href={`/obyava/${item._id}`}>
                <StyledProductImgDiv>
                    <StyledProductImg
                        src={`http://localhost:3005/img/${item.img[0]}`}
                        alt={item.name}
                    />
                </StyledProductImgDiv>

                <StyledProductTitle>
                    <StyledProductWrapper>
                        <StyledProductName>{item.name}</StyledProductName>
                        <StyledProductPrice>{item.price} грн.</StyledProductPrice>
                    </StyledProductWrapper>

                    <StyledProductWrapper>
                        <StyledProductDescription>
                            {item.location} · {date(item.date)}
                        </StyledProductDescription>
                    </StyledProductWrapper>
                </StyledProductTitle>
            </StyledProductLink>

            <StyledProductLike
                type="button"
                $selected={selected}
                disabled={isSaving}
                onClick={onClick}
            >
                <span>{selected ? 'В обраному' : 'В обране'}</span>
                <Like width={20} height={20} color="#3f6f58" checked={selected} />
            </StyledProductLike>
        </StyledCard>
    );
}