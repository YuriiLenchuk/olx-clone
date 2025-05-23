import {StyledSearch, StyledSearchInput, StyledSearchForm, StyledSearchButton} from './styled'
export default function Search() {
    return (
        <StyledSearch>
        <StyledSearchForm>
            <StyledSearchInput placeholder='Search'/>
            <StyledSearchButton>Поиск</StyledSearchButton>
        </StyledSearchForm>
        </StyledSearch>
    )
}