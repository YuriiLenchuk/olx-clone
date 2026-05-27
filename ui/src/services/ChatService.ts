import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';
import { Item } from '@/services/CategoryService';

export interface ChatUser {
    _id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    city?: string;
}

export interface Message {
    _id: string;
    chat: string;
    sender: ChatUser;
    text: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Chat {
    _id: string;
    item: Item;
    buyer: ChatUser;
    seller: ChatUser;
    lastMessageText?: string;
    lastMessageAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChatDetails {
    chat: Chat;
    messages: Message[];
}

class ChatService {
    private static getAuthHeaders(token: string) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    static createOrGetChat = async (
        token: string,
        itemId: string,
    ): Promise<Chat> => {
        try {
            const response = await api.post(
                '/chats',
                { itemId },
                {
                    headers: this.getAuthHeaders(token),
                },
            );

            return response.data.chat;
        } catch (e: any) {
            console.log(e, 'create chat error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getMyChats = async (token: string): Promise<Chat[]> => {
        try {
            const response = await api.get('/chats', {
                headers: this.getAuthHeaders(token),
            });

            return response.data.chats;
        } catch (e: any) {
            console.log(e, 'get chats error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static getChatById = async (
        token: string,
        chatId: string,
    ): Promise<ChatDetails> => {
        try {
            const response = await api.get(`/chats/${chatId}`, {
                headers: this.getAuthHeaders(token),
            });

            return response.data;
        } catch (e: any) {
            console.log(e, 'get chat by id error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static markAsRead = async (
        token: string,
        chatId: string,
    ): Promise<void> => {
        try {
            await api.patch(
                `/chats/${chatId}/read`,
                {},
                {
                    headers: this.getAuthHeaders(token),
                },
            );
        } catch (e: any) {
            console.log(e, 'mark chat as read error');
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export default ChatService;