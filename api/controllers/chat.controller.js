const Chat = require('../models/chat_model');
const Message = require('../models/message_model');
const Item = require('../models/item_model');

function getEntityId(entity) {
    if (!entity) return '';

    if (typeof entity === 'string') {
        return entity;
    }

    if (entity._id) {
        return String(entity._id);
    }

    return String(entity);
}

function isChatParticipant(chat, userId) {
    const buyerId = getEntityId(chat.buyer);
    const sellerId = getEntityId(chat.seller);
    const currentUserId = String(userId);

    return buyerId === currentUserId || sellerId === currentUserId;
}

const userSelect = 'username firstName lastName avatar city';

const createOrGetChat = async (req, res) => {
    try {
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({
                message: 'itemId є обовʼязковим',
            });
        }

        const item = await Item.findById(itemId).populate({
            path: 'owner',
            select: userSelect,
        });

        if (!item) {
            return res.status(404).json({
                message: 'Оголошення не знайдено',
            });
        }

        const sellerId = item.owner?._id || item.owner;
        const buyerId = req.user.id;

        if (String(sellerId) === String(buyerId)) {
            return res.status(400).json({
                message: 'Не можна створити чат із самим собою',
            });
        }

        let chat = await Chat.findOne({
            item: item._id,
            buyer: buyerId,
            seller: sellerId,
        });

        if (!chat) {
            chat = await Chat.create({
                item: item._id,
                buyer: buyerId,
                seller: sellerId,
            });
        }

        const populatedChat = await Chat.findById(chat._id)
            .populate({
                path: 'item',
                select: 'name img price location',
            })
            .populate({
                path: 'buyer',
                select: userSelect,
            })
            .populate({
                path: 'seller',
                select: userSelect,
            });

        return res.status(200).json({
            chat: populatedChat,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при створенні чату',
            error: error.message,
        });
    }
};

const getMyChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [{ buyer: req.user.id }, { seller: req.user.id }],
        })
            .sort({ lastMessageAt: -1, updatedAt: -1 })
            .populate({
                path: 'item',
                select: 'name img price location',
            })
            .populate({
                path: 'buyer',
                select: userSelect,
            })
            .populate({
                path: 'seller',
                select: userSelect,
            });

        return res.status(200).json({
            chats,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при отриманні чатів',
            error: error.message,
        });
    }
};

const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate({
                path: 'item',
                select: 'name img price location',
            })
            .populate({
                path: 'buyer',
                select: userSelect,
            })
            .populate({
                path: 'seller',
                select: userSelect,
            });

        if (!chat) {
            return res.status(404).json({
                message: 'Чат не знайдено',
            });
        }

        if (!isChatParticipant(chat, req.user.id)) {
            return res.status(403).json({
                message: 'Немає доступу до цього чату',
            });
        }

        const messages = await Message.find({
            chat: chat._id,
        })
            .sort({ createdAt: 1 })
            .populate({
                path: 'sender',
                select: userSelect,
            });

        return res.status(200).json({
            chat,
            messages,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при отриманні чату',
            error: error.message,
        });
    }
};

const markChatAsRead = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({
                message: 'Чат не знайдено',
            });
        }

        if (!isChatParticipant(chat, req.user.id)) {
            return res.status(403).json({
                message: 'Немає доступу до цього чату',
            });
        }

        await Message.updateMany(
            {
                chat: chat._id,
                sender: { $ne: req.user.id },
                isRead: false,
            },
            {
                $set: {
                    isRead: true,
                },
            },
        );

        return res.status(200).json({
            message: 'Повідомлення позначено як прочитані',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при оновленні повідомлень',
            error: error.message,
        });
    }
};

module.exports = {
    createOrGetChat,
    getMyChats,
    getChatById,
    markChatAsRead,
};