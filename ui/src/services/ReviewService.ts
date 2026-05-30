import api from '@/api';
import ErrorHandler from '@/services/ErrorHandler';
import {AuthUser} from "@/services/UserService";

export interface ReviewAuthor {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
}

export interface ReviewItem {
    _id: string;
    name: string;
    img?: string[];
    price?: number;
}

export interface Review {
    _id: string;
    targetUser: AuthUser;
    author: ReviewAuthor;
    item?: ReviewItem | null;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewsResponse {
    reviews: Review[];
    page: number;
    limit: number;
    totalReviews: number;
    totalPages: number;
}

class ReviewService {
    static getUserReviews = async (
        userId: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<ReviewsResponse> => {
        try {
            const response = await api.get(
                `/reviews/user/${userId}?page=${page}&limit=${limit}`,
            );

            return response.data;
        } catch (e: any) {
            console.log(e, 'error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static createReview = async (
        token: string,
        userId: string,
        payload: {
            rating: number;
            comment: string;
            item?: string;
        },
    ): Promise<Review> => {
        try {
            const response = await api.post(`/reviews/user/${userId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.review;
        } catch (e: any) {
            console.log(e, 'error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static updateReview = async (
        token: string,
        reviewId: string,
        payload: {
            rating?: number;
            comment?: string;
        },
    ): Promise<Review> => {
        try {
            const response = await api.patch(`/reviews/${reviewId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.review;
        } catch (e: any) {
            console.log(e, 'error');
            throw new ErrorHandler(e?.response?.data);
        }
    };

    static deleteReview = async (
        token: string,
        reviewId: string,
    ): Promise<void> => {
        try {
            await api.delete(`/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (e: any) {
            console.log(e, 'error');
            throw new ErrorHandler(e?.response?.data);
        }
    };
}

export default ReviewService;