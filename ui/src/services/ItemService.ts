import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';
import { Item } from '@/services/CategoryService';

export interface ItemsResponse {
    items: Item[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

class ItemService {
    private static getAuthHeaders(token: string) {
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        };
    }

    static createItem = async (
        token: string,
        formData: FormData,
    ): Promise<Item> => {
        try {
            const response = await api.post('/item', formData, {
                headers: this.getAuthHeaders(token),
            });

            return response.data.item || response.data;
        } catch (e: any) {
            console.log(e, 'create item error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getMyItems = async (
        token: string,
        page: number = 1,
        limit: number = 12,
    ): Promise<ItemsResponse> => {
        try {
            const response = await api.get(`/item/my?page=${page}&limit=${limit}`, {
                headers: this.getAuthHeaders(token),
            });

            return response.data;
        } catch (e: any) {
            console.log(e, 'get my items error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static updateItem = async (
        token: string,
        id: string,
        payload: Partial<Item>,
    ): Promise<Item> => {
        try {
            const response = await api.patch(`/item/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.item;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static deleteItem = async (
        token: string,
        id: string,
    ): Promise<void> => {
        try {
            await api.delete(`/item/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export default ItemService;