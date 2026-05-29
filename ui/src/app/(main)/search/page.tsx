import Search from "@/components/search/search";
import ItemCardMenu from "@/components/ItemCardMenu/ItemCardMenu";
import { CategoryService } from "@/services/CategoryService";

export default async function Page({ searchParams }: any) {
    const params = await searchParams;
    const rawSearch = params?.search;
    const search = Array.isArray(rawSearch) ? rawSearch[0] : rawSearch || '';

    const { items, totalPages } = await CategoryService.getItems(search, '-date');

    return (
        <div style={{ backgroundColor: '#F2F4F5' }}>
            <Search initialValue={search} />

            <ItemCardMenu
                key={search}
                initialItems={items}
                totalPages={totalPages}
                search={search}
            />
        </div>
    );
}