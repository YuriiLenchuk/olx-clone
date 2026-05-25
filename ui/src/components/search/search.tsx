'use client';

import {
    HeroContent,
    SearchHint,
    StyledSearch,
    StyledSearchButton,
    StyledSearchForm,
    StyledSearchInput,
} from './styled';

export default function Search() {
    return (
        <StyledSearch>
            <HeroContent>
                <SearchHint>Маркетплейс для швидких угод</SearchHint>
                <h1>Знайди потрібну річ або продай свою швидше</h1>
                <p>
                    Оголошення поруч, зрозумілі категорії та збережені пропозиції в одному місці.
                </p>
            </HeroContent>

            <StyledSearchForm>
                <StyledSearchInput
                    type="search"
                    placeholder="Що шукаємо? Наприклад: велосипед, ноутбук, диван..."
                />
                <StyledSearchButton type="submit">Шукати</StyledSearchButton>
            </StyledSearchForm>
        </StyledSearch>
    );
}