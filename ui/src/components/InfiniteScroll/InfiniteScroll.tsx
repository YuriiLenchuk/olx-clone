"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FavoriteService from '@/services/FavoriteService';
import { getValidAuthToken } from '@/Utils/authToken';

import { CategoryService, Item } from "@/services/CategoryService";
import ItemCard from "@/components/ItemCard/page";
import { ItemsGrid } from './styled';

type Props = {
    initialItems: Item[];
    totalPages: number;
    category?: string;
    selected: string;
    search?: string;
};


export default function InfiniteScroll({
                                           initialItems,
                                           totalPages,
                                           category = '',
                                           selected,
                                           search = '',
                                       }: Props) {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [page, setPage] = useState(1);
    const [currentTotalPages, setCurrentTotalPages] = useState(totalPages);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    const loaderRef = useRef<HTMLDivElement | null>(null);
    const isFetching = useRef(false);
    const prevSelected = useRef(selected);

    useEffect(() => {
        async function loadFavoriteIds() {
            const token = getValidAuthToken();

            if (!token) {
                setFavoriteIds([]);
                return;
            }

            const ids = await FavoriteService.getFavoriteIds(token);

            setFavoriteIds(ids);
        }

        loadFavoriteIds();
    }, []);

    const requestKey = useMemo(() => {
        return `${category || ''}:${search || ''}`;
    }, [category, search]);

    const fetchItems = async (nextPage: number, sort: string, reset = false) => {
        try {
            if (isFetching.current) return;

            isFetching.current = true;

            const response = category
                ? await CategoryService.getItemsByCategory(category, sort, nextPage)
                : await CategoryService.getItems(search, sort, nextPage);

            setItems((prev) => reset ? response.items : [...prev, ...response.items]);
            setCurrentTotalPages(response.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            isFetching.current = false;
        }
    };

    useEffect(() => {
        setItems(initialItems);
        setPage(1);
        setCurrentTotalPages(totalPages);
        prevSelected.current = selected;
    }, [initialItems, totalPages, requestKey]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];

                if (target.isIntersecting && page < currentTotalPages && !isFetching.current) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 },
        );

        const loader = loaderRef.current;

        if (loader) observer.observe(loader);

        return () => {
            if (loader) observer.unobserve(loader);
        };
    }, [page, currentTotalPages]);

    useEffect(() => {
        if (page > 1) {
            fetchItems(page, selected);
        }
    }, [page]);

    useEffect(() => {
        if (prevSelected.current !== selected) {
            setPage(1);
            fetchItems(1, selected, true);
            prevSelected.current = selected;
        }
    }, [selected]);

    return (
        <ItemsGrid>
            {items.map((item) => (
                <ItemCard
                    key={item._id}
                    item={item}
                    checked={favoriteIds.includes(item._id)}
                    onFavoriteChange={(itemId, isSelected) => {
                        setFavoriteIds((prev) =>
                            isSelected
                                ? Array.from(new Set([...prev, itemId]))
                                : prev.filter((id) => id !== itemId),
                        );
                    }}
                />
            ))}

            <div ref={loaderRef} style={{ height: "20px" }} />
        </ItemsGrid>
    );
}