import api from "@/api";
import ErrorHandler from "@/services/ErrorHandler";

interface Category {
    name: string,
    path: string,
    img: string,
    subcategories?: Array<Subcategory>,
}

interface Subcategory {
    name: string;
    path: string,
}

interface CategoryGroup {
    items: Item[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

interface Item {
    _id: string;
    name: string;
    img: string[];
    description: string;
    price: number;
    isNewState: boolean;
    owner?: {
        username?: string;
        email?: string;
        phone?: string;
        city?: string;
    };
    location: string;
    categoryData: {
        category: string;
        subcategory?: string;
    };
    date: string;
}

class CategoryService {
    static getCategories = async (): Promise<Category[]> => {
        try {
            const d = await api.get("/category/");
            return d.data;
        } catch (e: any) {
            console.log(e, "error")
            throw new ErrorHandler(e?.response?.data);
        }
    }

    static getItemsByCategory = async (category: string, sort: string, page: number = 1, limit: number = 10): Promise<CategoryGroup> => {
        try {
            const items = await api.get(`/item/category/${category}?page=${page}&limit=${limit}&sort=${sort}`);
            return items.data;
        } catch (e: any) {
            console.log(e, "error")
            throw new ErrorHandler(e?.response?.data);
        }
    }
    
    static getItemById = async (id: string): Promise<Item> => {
        try {
            const response = await api.get(`/item/${id}`);

            return response.data.item || response.data.items || response.data;
        } catch (e: any) {
            console.log(e, 'error');
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export {
    CategoryService
};
export type {
    Category,
    Subcategory,
    CategoryGroup,
    Item
};
