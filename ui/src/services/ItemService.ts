import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';
import { Item } from '@/services/CategoryService';

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
}

export default ItemService;