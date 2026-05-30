import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';

export type ReportReason =
    | 'fraud'
    | 'wrong_category'
    | 'prohibited'
    | 'fake'
    | 'duplicate'
    | 'offensive'
    | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Report {
    _id: string;
    item: string;
    reporter: string;
    reason: ReportReason;
    comment: string;
    status: ReportStatus;
    adminComment?: string;
    createdAt: string;
    updatedAt: string;
}

export const REPORT_REASON_OPTIONS: Array<{
    value: ReportReason;
    label: string;
}> = [
    { value: 'fraud', label: 'Шахрайство' },
    { value: 'wrong_category', label: 'Неправильна категорія' },
    { value: 'prohibited', label: 'Заборонений товар' },
    { value: 'fake', label: 'Фейкове оголошення' },
    { value: 'duplicate', label: 'Дублікат' },
    { value: 'offensive', label: 'Образливий контент' },
    { value: 'other', label: 'Інше' },
];

class ReportService {
    private static getAuthHeaders(token: string) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    static createReport = async (
        token: string,
        payload: {
            itemId: string;
            reason: ReportReason;
            comment?: string;
        },
    ): Promise<Report> => {
        try {
            const response = await api.post('/reports', payload, {
                headers: this.getAuthHeaders(token),
            });

            return response.data.report;
        } catch (e: any) {
            console.log(e, 'create report error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getMyReportForItem = async (
        token: string,
        itemId: string,
    ): Promise<Report | null> => {
        try {
            const response = await api.get(`/reports/item/${itemId}/me`, {
                headers: this.getAuthHeaders(token),
            });

            return response.data.report || null;
        } catch (e: any) {
            console.log(e, 'get my item report error');
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export default ReportService;