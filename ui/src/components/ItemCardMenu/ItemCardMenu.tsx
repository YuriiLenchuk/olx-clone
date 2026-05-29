"use client";

import { useState, ReactNode } from "react";

import { StyledSort } from "./styled";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import InfiniteScroll from "@/components/InfiniteScroll/InfiniteScroll";
import { Item } from "@/services/CategoryService";

type Option = { value: string; label: ReactNode };

const options: Option[] = [
    { value: "-date", label: "Найновіші" },
    { value: "price", label: "Найдешевші" },
    { value: "-price", label: "Найдорожчі" },
];

type Props = {
    initialItems: Item[];
    totalPages: number;
    category?: string;
    search?: string;
};

export default function ItemCardMenu({
                                         initialItems,
                                         totalPages,
                                         category,
                                         search = '',
                                     }: Props) {
    const [selected, setSelected] = useState<string>("-date");

    return (
        <>
            <StyledSort>
                <span>Сортувати за:</span>
                <CustomSelect options={options} value={selected} onChange={setSelected} />
            </StyledSort>

            <InfiniteScroll
                initialItems={initialItems}
                totalPages={totalPages}
                category={category}
                selected={selected}
                search={search}
            />
        </>
    );
}