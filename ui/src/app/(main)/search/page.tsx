import {CategoryService} from "@/services/CategoryService";
import ItemCardMenu from "@/components/ItemCardMenu/ItemCardMenu";


export default async function Page({searchParams}: any) {
    const queryParam = new URLSearchParams(searchParams).toString();
    const {items, totalPages}  = await CategoryService.getItems(queryParam);

    return (
        <div style={{backgroundColor: '#F2F4F5'}}>
            <ItemCardMenu initialItems={items} totalPages={totalPages} />
        </div>
)
}