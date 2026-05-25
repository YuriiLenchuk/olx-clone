import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';

export interface AuthData {
    username: string;
    password: string;
}

export interface RegistrationData {
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
}

export interface AuthUser {
    _id?: string;
    id?: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    avatar?: string;
    roles?: string[];
    averageRating?: number;
    reviewsCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

export interface UpdateUserPayload {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    avatar?: string;
}

class UserService {
    private static getAuthHeaders(token: string) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    static registration = async (
        payload: RegistrationData,
    ): Promise<AuthResponse> => {
        try {
            const response = await api.post('/auth/registration', payload);

            return response.data;
        } catch (e: any) {
            console.log(e, 'registration error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static login = async ({
                              username,
                              password,
                          }: AuthData): Promise<AuthResponse> => {
        try {
            const response = await api.post('/auth/login', {
                username,
                password,
            });

            return response.data;
        } catch (e: any) {
            console.log(e, 'login error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static me = async (token: string): Promise<AuthUser> => {
        try {
            const response = await api.get('/auth/me', {
                headers: this.getAuthHeaders(token),
            });

            return response.data.user;
        } catch (e: any) {
            console.log(e, 'me error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static updateMe = async (
        token: string,
        payload: UpdateUserPayload,
    ): Promise<AuthUser> => {
        try {
            const response = await api.patch('/auth/me', payload, {
                headers: this.getAuthHeaders(token),
            });

            return response.data.user;
        } catch (e: any) {
            console.log(e, 'update me error');
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export default UserService;