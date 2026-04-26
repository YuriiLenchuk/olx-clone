import {Category, Subcategory} from "@/services/CategoryService";

type Props = {
    selectedCategory : Category
}

export const SubcategoryPanel = ({selectedCategory} : Props) => {
    return (
        <div>{selectedCategory?.subcategories?.map((i: Subcategory) => (<span>{i.name}</span>))}</div>
    )
}