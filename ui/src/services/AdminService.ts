import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';
import { ReportReason, ReportStatus } from '@/services/ReportService';

export type AdminReportFilter = ReportStatus | 'all';
export type AdminItemStatus = 'active' | 'archived' | 'all';
export type AdminUserStatus = 'active' | 'blocked' | 'all';
export type AdminRoleFilter = 'USER' | 'ADMIN' | 'all';

export interface AdminUser {
    _id: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    roles?: string[];
    isBlocked?: boolean;
    blockedReason?: string;
    createdAt?: string;
}

export interface AdminItem {
    _id: string;
    name: string;
    img?: string[];
    description?: string;
    price?: number;
    location?: string;
    owner?: AdminUser;
    categoryData?: {
        category?: string;
        subcategory?: string;
    };
    isArchived?: boolean;
    archivedAt?: string | null;
    date?: string;
}

export interface AdminReport {
    _id: string;
    item: AdminItem | string | null;
    reporter: AdminUser | string | null;
    reason: ReportReason;
    comment: string;
    status: ReportStatus;
    adminComment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminStats {
    users: {
        total: number;
        blocked: number;
        admins: number;
    };
    items: {
        total: number;
        active: number;
        archived: number;
    };
    reports: {
        total: number;
        byStatus: Record<ReportStatus, number>;
    };
}

export interface AdminReportsResponse {
    reports: AdminReport[];
    page: number;
    limit: number;
    totalPages: number;
    totalReports: number;
}

export interface AdminItemsResponse {
    items: AdminItem[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

export interface AdminUsersResponse {
    users: AdminUser[];
    page: number;
    limit: number;
    totalPages: number;
    totalUsers: number;
}

class AdminService {
    private static getAuthHeaders(token: string) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    static getStats = async (token: string): Promise<AdminStats> => {
        try {
            const response = await api.get('/admin/stats', {
                headers: this.getAuthHeaders(token),
            });

            return response.data;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getReports = async (
        token: string,
        status: AdminReportFilter = 'pending',
        page: number = 1,
        limit: number = 20,
    ): Promise<AdminReportsResponse> => {
        try {
            const params = new URLSearchParams();

            params.set('status', status);
            params.set('page', String(page));
            params.set('limit', String(limit));

            const response = await api.get(`/reports/admin?${params.toString()}`, {
                headers: this.getAuthHeaders(token),
            });

            return response.data;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static updateReportStatus = async (
        token: string,
        reportId: string,
        status: ReportStatus,
        adminComment: string = '',
    ): Promise<AdminReport> => {
        try {
            const response = await api.patch(
                `/reports/admin/${reportId}`,
                { status, adminComment },
                { headers: this.getAuthHeaders(token) },
            );

            return response.data.report;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getItems = async (
        token: string,
        options: {
            search?: string;
            status?: AdminItemStatus;
            sort?: string;
            page?: number;
            limit?: number;
        } = {},
    ): Promise<AdminItemsResponse> => {
        try {
            const params = new URLSearchParams();

            params.set('status', options.status || 'active');
            params.set('page', String(options.page || 1));
            params.set('limit', String(options.limit || 20));

            if (options.search?.trim()) params.set('search', options.search.trim());
            if (options.sort) params.set('sort', options.sort);

            const response = await api.get(`/admin/items?${params.toString()}`, {
                headers: this.getAuthHeaders(token),
            });

            return response.data;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static archiveItem = async (token: string, itemId: string): Promise<AdminItem> => {
        try {
            const response = await api.patch(
                `/admin/items/${itemId}/archive`,
                {},
                { headers: this.getAuthHeaders(token) },
            );

            return response.data.item;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static restoreItem = async (token: string, itemId: string): Promise<AdminItem> => {
        try {
            const response = await api.patch(
                `/admin/items/${itemId}/restore`,
                {},
                { headers: this.getAuthHeaders(token) },
            );

            return response.data.item;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getUsers = async (
        token: string,
        options: {
            search?: string;
            role?: AdminRoleFilter;
            status?: AdminUserStatus;
            page?: number;
            limit?: number;
        } = {},
    ): Promise<AdminUsersResponse> => {
        try {
            const params = new URLSearchParams();

            params.set('role', options.role || 'all');
            params.set('status', options.status || 'all');
            params.set('page', String(options.page || 1));
            params.set('limit', String(options.limit || 20));

            if (options.search?.trim()) params.set('search', options.search.trim());

            const response = await api.get(`/admin/users?${params.toString()}`, {
                headers: this.getAuthHeaders(token),
            });

            return response.data;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static updateUserRoles = async (
        token: string,
        userId: string,
        roles: string[],
    ): Promise<AdminUser> => {
        try {
            const response = await api.patch(
                `/admin/users/${userId}/roles`,
                { roles },
                { headers: this.getAuthHeaders(token) },
            );

            return response.data.user;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static updateUserBlock = async (
        token: string,
        userId: string,
        isBlocked: boolean,
        blockedReason: string = '',
    ): Promise<AdminUser> => {
        try {
            const response = await api.patch(
                `/admin/users/${userId}/block`,
                { isBlocked, blockedReason },
                { headers: this.getAuthHeaders(token) },
            );

            return response.data.user;
        } catch (e: any) {
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export default AdminService;