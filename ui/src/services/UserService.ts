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

export interface UpdateUsernamePayload {
    username: string;
}

export interface UpdatePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface DeleteAccountPayload {
    currentPassword: string;
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

    static updateUsername = async (
        token: string,
        payload: UpdateUsernamePayload,
    ): Promise<AuthUser> => {
        try {
            const response = await api.patch('/auth/me/username', payload, {
                headers: this.getAuthHeaders(token),
            });

            return response.data.user;
        } catch (e: any) {
            console.log(e, 'update username error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static updatePassword = async (
        token: string,
        payload: UpdatePasswordPayload,
    ): Promise<void> => {
        try {
            await api.patch('/auth/me/password', payload, {
                headers: this.getAuthHeaders(token),
            });
        } catch (e: any) {
            console.log(e, 'update password error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static deleteMe = async (
        token: string,
        payload: DeleteAccountPayload,
    ): Promise<void> => {
        try {
            await api.delete('/auth/me', {
                headers: this.getAuthHeaders(token),
                data: payload,
            });
        } catch (e: any) {
            console.log(e, 'delete account error');
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export default UserService;