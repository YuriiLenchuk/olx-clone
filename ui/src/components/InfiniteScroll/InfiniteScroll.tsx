"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";

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

function getCheckedIds(): string[] {
    try {
        const cookie = Cookies.get('checked');

        if (!cookie) return [];

        const parsed = JSON.parse(cookie);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

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

    const loaderRef = useRef<HTMLDivElement | null>(null);
    const isFetching = useRef(false);
    const prevSelected = useRef(selected);

    const requestKey = useMemo(() => {
        return `${category || ''}:${search || ''}`;
    }, [category, search]);

    const checkedIds = getCheckedIds();

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
                    checked={checkedIds.includes(item._id)}
                />
            ))}

            <div ref={loaderRef} style={{ height: "20px" }} />
        </ItemsGrid>
    );
}