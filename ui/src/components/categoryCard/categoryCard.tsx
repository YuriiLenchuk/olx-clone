import React, {Dispatch, SetStateAction, useMemo} from "react";
import { StyledCategoryCard } from "@/components/categoryCard/styled";
import { Category } from "@/services/CategoryService";
import {SubcategoryPanel} from "@/components/subcategory/subcategoryPanel";

type Props = {
    category: Category,
    selectedCategory: Category | undefined,
    setSelectedCategory: Dispatch<SetStateAction<Category | undefined>>,
};

export const CategoryCard: React.FC<Props> = ({ category, setSelectedCategory, selectedCategory }: Props) => {
    const generateRandomColor = useMemo(() => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }, []) ;

    return (
        <div>
            <StyledCategoryCard color={generateRandomColor}>
                <div onClick={() => setSelectedCategory(category)}>
                    <img
                        src={`http://localhost:3005/img/${category.img}`}
                        alt={`${category.name}`}
                        width="95px"
                        height="95px"
                    />
                    <p>{category.name}</p>
                </div>
            </StyledCategoryCard>
            {selectedCategory?.name === category.name && <SubcategoryPanel selectedCategory={selectedCategory}/>}
        </div>
    );
};
