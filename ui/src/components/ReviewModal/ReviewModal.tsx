'use client';

import { FormEvent, useEffect, useState } from 'react';
import ReviewService from '@/services/ReviewService';
import {
    Actions,
    Backdrop,
    Card,
    ErrorText,
    Header,
    PrimaryButton,
    RatingButton,
    RatingRow,
    SecondaryButton,
    TextArea,
} from './styled';

type Props = {
    isOpen: boolean;
    token: string;
    targetUserId: string;
    targetUserName?: string;
    itemId?: string;
    itemName?: string;
    onClose: () => void;
    onSuccess?: () => void;
};

export default function ReviewModal({
                                        isOpen,
                                        token,
                                        targetUserId,
                                        targetUserName,
                                        itemId,
                                        itemName,
                                        onClose,
                                        onSuccess,
                                    }: Props) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setRating(5);
        setComment('');
        setError('');
        setIsSubmitting(false);
    }, [isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!token || !targetUserId) {
            setError('Не вдалося визначити користувача для відгуку');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            await ReviewService.createReview(token, targetUserId, {
                rating,
                comment: comment.trim(),
                item: itemId,
            });

            onSuccess?.();
            onClose();
        } catch (e: any) {
            setError(e?.message || 'Не вдалося додати відгук');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Backdrop onMouseDown={onClose}>
            <Card onMouseDown={(event) => event.stopPropagation()}>
                <Header>
                    <div>
                        <h2>Залишити відгук</h2>
                        <p>
                            {targetUserName || 'Продавець'}
                            {itemName ? ` · ${itemName}` : ''}
                        </p>
                    </div>

                    <SecondaryButton type="button" onClick={onClose}>
                        Закрити
                    </SecondaryButton>
                </Header>

                <form onSubmit={handleSubmit}>
                    <RatingRow>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <RatingButton
                                key={value}
                                type="button"
                                $active={rating === value}
                                onClick={() => setRating(value)}
                            >
                                {value}
                            </RatingButton>
                        ))}
                    </RatingRow>

                    <TextArea
                        value={comment}
                        maxLength={500}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Опишіть, як пройшла угода"
                    />

                    {error && <ErrorText>{error}</ErrorText>}

                    <Actions>
                        <SecondaryButton type="button" onClick={onClose}>
                            Скасувати
                        </SecondaryButton>

                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Надсилання...' : 'Надіслати відгук'}
                        </PrimaryButton>
                    </Actions>
                </form>
            </Card>
        </Backdrop>
    );
}