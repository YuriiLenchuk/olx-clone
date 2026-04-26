import Search from "@/components/search/search";
import { Categories } from "@/components/categories/categories";
import { VipAdv } from "@/components/vip-adv/vip-adv";
import {CategoryService} from "@/services/CategoryService";




// Компонент Home отримує categories як проп
export default async function Home() {
    const categories = await CategoryService.getCategories();
  return (
      <article>
        <Search />
            <Categories categories={categories} />
        <VipAdv />
      </article>
  );
}
