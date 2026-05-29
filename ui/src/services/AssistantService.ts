import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';

export type AssistantRole = 'user' | 'assistant';

export interface AssistantHistoryMessage {
    role: AssistantRole;
    content: string;
}

export interface AssistantItem {
    id: string;
    title: string;
    url: string;
    reason: string;
    price?: number;
    location?: string;
    image?: string | null;
}

export interface AssistantSource {
    title: string;
    uri: string;
}

export interface AssistantGrounding {
    usedWeb: boolean;
    queries: string[];
    sources: AssistantSource[];
    searchEntryPoint?: string | null;
}

export interface AssistantResponse {
    answer: string;
    items: AssistantItem[];
    grounding: AssistantGrounding;
}

class AssistantService {
    static ask = async (
        message: string,
        history: AssistantHistoryMessage[] = [],
    ): Promise<AssistantResponse> => {
        try {
            const response = await api.post('/assistant/ask', {
                message,
                history,
            });

            return response.data;
        } catch (e: any) {
            console.log(e, 'assistant error');
            throw new ErrorHandler(e?.response?.data || {
                message: 'Помилка при зверненні до AI-консультанта',
            });
        }
    };
}

export default AssistantService;