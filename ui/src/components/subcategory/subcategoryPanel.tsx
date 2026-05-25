'use client';

import Link from 'next/link';

import { Category, Subcategory } from '@/services/CategoryService';
import {
    EmptyText,
    Panel,
    PanelCount,
    PanelHeader,
    PanelTitle,
    SubcategoryLink,
    SubcategoryList,
} from './styled';

type Props = {
    selectedCategory: Category;
};

export const SubcategoryPanel = ({ selectedCategory }: Props) => {
    const subcategories = selectedCategory?.subcategories ?? [];

    return (
        <Panel>
            <PanelHeader>
                <PanelTitle>{selectedCategory.name}</PanelTitle>
                <PanelCount>{subcategories.length} розділів</PanelCount>
            </PanelHeader>

            {subcategories.length > 0 ? (
                <SubcategoryList>
                    {subcategories.map((subcategory: Subcategory) => (
                        <li key={subcategory.path || subcategory.name}>
                            <SubcategoryLink
                                href={`/category/${selectedCategory.path}/${subcategory.path}`}
                            >
                                <span>{subcategory.name}</span>
                                <b>›</b>
                            </SubcategoryLink>
                        </li>
                    ))}
                </SubcategoryList>
            ) : (
                <EmptyText>Підкатегорії поки не додані</EmptyText>
            )}
        </Panel>
    );
};