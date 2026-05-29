"use client";

import { useEffect, useRef, useState } from "react";
import { CategoryService, Item } from "@/services/CategoryService";
import ItemCard from "@/components/ItemCard/page";
import {ItemsGrid} from './styled'
import Cookies from "js-cookie";
import {useSearchParams} from "next/navigation";

type Props = {
    initialItems: Item[];
    totalPages: number;
    category?: string | undefined;
    selected: string;
    search?: string;
};

export default function InfiniteScroll({ initialItems, totalPages, category, selected, search}: Props) {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [page, setPage] = useState(1);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const isFetching = useRef(false);
    const prevSelected = useRef(selected);

    const fetchItems = async (page: number, sort: string, reset = false) => {
       try {
           if (isFetching.current) return;
           isFetching.current = true;

           if (category){
               const { items: newItems } = await CategoryService.getItemsByCategory(category, sort, page);
               setItems((prev) => reset ? newItems : [...prev, ...newItems]);
           } else {
               const { items: newItems } = await CategoryService.getItems(search, sort, page);
               setItems((prev) => reset ? newItems : [...prev, ...newItems]);
           }

           isFetching.current = false;
       } catch (error) {
           console.error(error);
       }
    };

    // 🔹 Спостерігаємо за скролом
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && page < totalPages) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [page, totalPages]);

    useEffect(() => {
        if (page > 1) fetchItems(page, selected);
    }, [page, search]);


    useEffect(() => {
        if (prevSelected.current !== selected) {
            setPage(1);
            fetchItems(1, selected, true);
            prevSelected.current = selected;
        }
    }, [selected, search]);
    return (
        <ItemsGrid>
            {items.map((item) => {
                return (<ItemCard key={item._id} item={item} checked={JSON.parse((Cookies.get('checked') || null) as string)?.includes(item._id)} />)
            })}

            {/* sentinel */}
            <div ref={loaderRef} style={{ height: "20px" }} />

        </ItemsGrid>
    );
}
