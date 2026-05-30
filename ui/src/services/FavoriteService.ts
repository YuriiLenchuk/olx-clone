import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';
import { Item } from '@/services/CategoryService';

class FavoriteService {
    private static getAuthHeaders(token: string) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    static getFavorites = async (token: string): Promise<{ items: Item[]; favoriteIds: string[] }> => {
        try {
            const response = await api.get('/favorites', {
                headers: this.getAuthHeaders(token),
            });

            return response.data;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getFavoriteIds = async (token: string): Promise<string[]> => {
        try {
            const response = await api.get('/favorites/ids', {
                headers: this.getAuthHeaders(token),
            });

            return response.data.favoriteIds || [];
        } catch {
            return [];
        }
    };

    static addFavorite = async (token: string, itemId: string): Promise<void> => {
        try {
            await api.post(`/favorites/${itemId}`, {}, {
                headers: this.getAuthHeaders(token),
            });
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static removeFavorite = async (token: string, itemId: string): Promise<void> => {
        try {
            await api.delete(`/favorites/${itemId}`, {
                headers: this.getAuthHeaders(token),
            });
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static clearFavorites = async (token: string): Promise<void> => {
        try {
            await api.delete('/favorites', {
                headers: this.getAuthHeaders(token),
            });
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export default FavoriteService;