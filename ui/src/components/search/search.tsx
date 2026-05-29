'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
    HeroContent,
    SearchHint,
    StyledSearch,
    StyledSearchButton,
    StyledSearchForm,
    StyledSearchInput,
} from './styled';

interface SearchProps {
    initialValue?: string;
}

export default function Search({ initialValue = '' }: SearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState(initialValue);

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const normalizedQuery = query.trim();

        if (!normalizedQuery) return;

        router.push(`/search?search=${encodeURIComponent(normalizedQuery)}`);
    }

    return (
        <StyledSearch>
            <HeroContent>
                <SearchHint>Маркетплейс для швидких угод</SearchHint>
                <h1>Знайди потрібну річ або продай свою швидше</h1>
                <p>
                    Оголошення поруч, зрозумілі категорії та збережені пропозиції в одному місці.
                </p>
            </HeroContent>

            <StyledSearchForm onSubmit={handleSubmit}>
                <StyledSearchInput
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Що шукаємо? Наприклад: велосипед, ноутбук, диван..."
                />
                <StyledSearchButton type="submit">Шукати</StyledSearchButton>
            </StyledSearchForm>
        </StyledSearch>
    );
}