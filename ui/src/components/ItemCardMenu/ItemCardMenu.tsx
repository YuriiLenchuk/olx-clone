"use client";

import { useState, ReactNode} from "react";
import {StyledSort, StyledHr} from "./styled";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import InfiniteScroll from "@/components/InfiniteScroll/InfiniteScroll";
import {Item} from "@/services/CategoryService";
import {useSearchParams} from "next/navigation";
import Search from "@/components/search/search";

type Option = { value: string; label: ReactNode };
const options: Option[] = [
    {value: "-date", label: "Найновіші"},
    {value: "price", label: "Найдешевщі"},
    {value: "-price", label: "Найдорожчі"},
];

type Props = {
    initialItems: Item[];
    totalPages: number;
    category?: string;
}

export default function ItemCardMenu({initialItems, totalPages, category}: Props) {
    const [selected, setSelected] = useState<string>("-date");
    const [search, setSearch] = useState<string>(useSearchParams().get('search') || '');

    return (
        <>
            <Search setSearch = {setSearch} />
            <StyledHr/>
            <StyledSort>
                <span>Сортувати за:</span>
                <CustomSelect options={options} value={selected} onChange={setSelected} />
            </StyledSort>
            <InfiniteScroll initialItems={initialItems} totalPages={totalPages} category={category} selected={selected} search={search} />
        </>
    );
}
