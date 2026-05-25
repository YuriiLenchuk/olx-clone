'use client'
import React from "react";
import {StyledCategories, StyledCategoriesList} from "@/components/categories/styled";
import {Category} from "@/services/CategoryService";
import {CategoryCard} from "@/components/categoryCard/categoryCard";

type Props = {
    categories: Array<Category>;
}

export const Categories: React.FC<Props> = ({categories}: Props) => {

    const [selectedCategory, setSelectedCategory] = React.useState<Category>();

    return (
        <StyledCategories>
            <div>
                <h2>Категорії</h2>
            </div>
            <StyledCategoriesList>
                {categories.map((category: Category) => (
                    <CategoryCard
                        key={category.name}
                        category={category}
                        setSelectedCategory={setSelectedCategory}
                        selectedCategory={selectedCategory}
                    />
                ))}
            </StyledCategoriesList>
        </StyledCategories>
    )
}