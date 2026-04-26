import {CategoryService} from "@/services/CategoryService";
import Search from "@/components/search/search";
import {StyledHr} from "./styled";
import ItemCardMenu from "@/components/ItemCardMenu/ItemCardMenu";


export default async function Page ({params} : any) {
    const { category } = await params;

    const {items, totalPages}  = await CategoryService.getItemsByCategory(category[category.length - 1], '-date');

    return (
        <div style={{backgroundColor: '#F2F4F5'}}>
            <Search />
            <StyledHr/>
            <ItemCardMenu initialItems={items} totalPages={totalPages} category={category[category.length - 1]} />
        </div>
    )
}