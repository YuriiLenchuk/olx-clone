'use client';

import React, { Dispatch, SetStateAction, useMemo } from 'react';

import { Category } from '@/services/CategoryService';
import { SubcategoryPanel } from '@/components/subcategory/subcategoryPanel';
import {
    StyledCategoryButton,
    StyledCategoryIcon,
    StyledCategoryLink,
    StyledCategoryName,
    StyledCategoryWrapper,
} from '@/components/categoryCard/styled';

type Props = {
    category: Category;
    selectedCategory: Category | undefined;
    setSelectedCategory: Dispatch<SetStateAction<Category | undefined>>;
};

const palette = ['#FFE8B8', '#DCEFE3', '#E7E1FF', '#FFDAD6', '#DFF1FF', '#F2E5D7'];

function getColorByName(name: string) {
    const index =
        name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) %
        palette.length;

    return palette[index];
}

function getCategoryHref(category: Category) {
    return `/category/${category.path}`;
}

export const CategoryCard: React.FC<Props> = ({
                                                  category,
                                                  setSelectedCategory,
                                                  selectedCategory,
                                              }) => {
    const color = useMemo(() => getColorByName(category.name), [category.name]);
    const isActive = selectedCategory?.name === category.name;
    const hasSubcategories = Boolean(category.subcategories?.length);

    if (!hasSubcategories) {
        return (
            <StyledCategoryWrapper>
                <StyledCategoryLink href={getCategoryHref(category)}>
                    <StyledCategoryIcon $color={color}>
                        <img
                            src={`http://localhost:3005/img/${category.img}`}
                            alt={category.name}
                        />
                    </StyledCategoryIcon>

                    <StyledCategoryName>{category.name}</StyledCategoryName>
                </StyledCategoryLink>
            </StyledCategoryWrapper>
        );
    }

    return (
        <StyledCategoryWrapper>
            <StyledCategoryButton
                type="button"
                $active={isActive}
                aria-expanded={isActive}
                onClick={() =>
                    setSelectedCategory((prev) =>
                        prev?.name === category.name ? undefined : category
                    )
                }
            >
                <StyledCategoryIcon $color={color}>
                    <img
                        src={`http://localhost:3005/img/${category.img}`}
                        alt={category.name}
                    />
                </StyledCategoryIcon>

                <StyledCategoryName>{category.name}</StyledCategoryName>
            </StyledCategoryButton>

            {isActive && <SubcategoryPanel selectedCategory={category} />}
        </StyledCategoryWrapper>
    );
};