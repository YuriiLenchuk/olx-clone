import { Item } from '@/services/CategoryService';

export const ASSISTANT_COMPARE_STORAGE_KEY = 'assistant_compare_items';
export const ASSISTANT_COMPARE_UPDATED_EVENT = 'assistant-compare-updated';

export interface CompareItem {
    id: string;
    title: string;
    price: number;
    location: string;
    image?: string | null;
    url: string;
}

function canUseWindow() {
    return typeof window !== 'undefined';
}

function notifyCompareUpdated() {
    if (!canUseWindow()) return;

    window.dispatchEvent(new Event(ASSISTANT_COMPARE_UPDATED_EVENT));
}

export function getCompareItems(): CompareItem[] {
    if (!canUseWindow()) return [];

    try {
        const rawItems = window.localStorage.getItem(ASSISTANT_COMPARE_STORAGE_KEY);

        if (!rawItems) return [];

        const items = JSON.parse(rawItems);

        return Array.isArray(items) ? items : [];
    } catch {
        return [];
    }
}

export function setCompareItems(items: CompareItem[]) {
    if (!canUseWindow()) return;

    window.localStorage.setItem(
        ASSISTANT_COMPARE_STORAGE_KEY,
        JSON.stringify(items.slice(0, 4)),
    );

    notifyCompareUpdated();
}

export function addCompareItem(item: CompareItem) {
    const currentItems = getCompareItems();
    const filteredItems = currentItems.filter(compareItem => compareItem.id !== item.id);

    setCompareItems([item, ...filteredItems].slice(0, 4));
}

export function removeCompareItem(id: string) {
    setCompareItems(getCompareItems().filter(item => item.id !== id));
}

export function clearCompareItems() {
    setCompareItems([]);
}

export function createCompareItemFromItem(item: Item): CompareItem {
    return {
        id: item._id,
        title: item.name,
        price: item.price,
        location: item.location,
        image: item.img?.[0] || null,
        url: `/obyava/${item._id}`,
    };
}