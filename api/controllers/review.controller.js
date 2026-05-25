const Review = require('../models/review_model');
const User = require('../models/user_model');

async function recalculateUserRating(userId) {
    const result = await Review.aggregate([
        {
            $match: {
                targetUser: userId,
            },
        },
        {
            $group: {
                _id: '$targetUser',
                averageRating: {
                    $avg: '$rating',
                },
                reviewsCount: {
                    $sum: 1,
                },
            },
        },
    ]);

    const stats = result[0];

    await User.findByIdAndUpdate(userId, {
        averageRating: stats ? Number(stats.averageRating.toFixed(1)) : 0,
        reviewsCount: stats ? stats.reviewsCount : 0,
    });
}

const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const userExists = await User.exists({ _id: userId });

        if (!userExists) {
            return res.status(404).json({
                message: 'Користувача не знайдено',
            });
        }

        const [reviews, totalReviews] = await Promise.all([
            Review.find({
                targetUser: userId,
            })
                .populate({
                    path: 'author',
                    select: 'username firstName lastName avatar',
                })
                .populate({
                    path: 'item',
                    select: 'name img price',
                })
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(limit),

            Review.countDocuments({
                targetUser: userId,
            }),
        ]);

        return res.status(200).json({
            reviews,
            page,
            limit,
            totalReviews,
            totalPages: Math.ceil(totalReviews / limit),
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при отриманні відгуків',
            error: error.message,
        });
    }
};

const createReview = async (req, res) => {
    try {
        const { userId } = req.params;
        const { rating, comment, item } = req.body;

        if (String(req.user.id) === String(userId)) {
            return res.status(400).json({
                message: 'Не можна залишати відгук самому собі',
            });
        }

        const targetUser = await User.findById(userId);

        if (!targetUser) {
            return res.status(404).json({
                message: 'Користувача не знайдено',
            });
        }

        const existingReview = await Review.findOne({
            targetUser: userId,
            author: req.user.id,
        });

        if (existingReview) {
            return res.status(409).json({
                message: 'Ви вже залишали відгук цьому користувачу',
            });
        }

        const review = await Review.create({
            targetUser: userId,
            author: req.user.id,
            item: item || null,
            rating: Number(rating),
            comment: comment || '',
        });

        await recalculateUserRating(targetUser._id);

        const populatedReview = await Review.findById(review._id)
            .populate({
                path: 'author',
                select: 'username firstName lastName avatar',
            })
            .populate({
                path: 'item',
                select: 'name img price',
            });

        const updatedUser = await User.findById(userId).select('-password');

        return res.status(201).json({
            message: 'Відгук додано',
            review: populatedReview,
            user: updatedUser,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Ви вже залишали відгук цьому користувачу',
            });
        }

        return res.status(500).json({
            message: 'Помилка при додаванні відгуку',
            error: error.message,
        });
    }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                message: 'Відгук не знайдено',
            });
        }

        if (String(review.author) !== String(req.user.id)) {
            return res.status(403).json({
                message: 'Ви можете редагувати тільки власні відгуки',
            });
        }

        review.rating = rating ?? review.rating;
        review.comment = comment ?? review.comment;

        await review.save();
        await recalculateUserRating(review.targetUser);

        const populatedReview = await Review.findById(review._id)
            .populate({
                path: 'author',
                select: 'username firstName lastName avatar',
            })
            .populate({
                path: 'item',
                select: 'name img price',
            });

        return res.status(200).json({
            message: 'Відгук оновлено',
            review: populatedReview,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при оновленні відгуку',
            error: error.message,
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                message: 'Відгук не знайдено',
            });
        }

        if (String(review.author) !== String(req.user.id)) {
            return res.status(403).json({
                message: 'Ви можете видаляти тільки власні відгуки',
            });
        }

        const targetUserId = review.targetUser;

        await Review.findByIdAndDelete(id);
        await recalculateUserRating(targetUserId);

        return res.status(200).json({
            message: 'Відгук видалено',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при видаленні відгуку',
            error: error.message,
        });
    }
};

module.exports = {
    getUserReviews,
    createReview,
    updateReview,
    deleteReview,
};
