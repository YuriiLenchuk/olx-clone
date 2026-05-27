const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const { secret } = require('../config');
const Chat = require('../models/chat_model');
const Message = require('../models/message_model');

const userSelect = 'username firstName lastName avatar city';

function isChatParticipant(chat, userId) {
    return (
        String(chat.buyer) === String(userId) ||
        String(chat.seller) === String(userId)
    );
}

async function getChatForUser(chatId, userId) {
    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new Error('Чат не знайдено');
    }

    if (!isChatParticipant(chat, userId)) {
        throw new Error('Немає доступу до цього чату');
    }

    return chat;
}

function getTokenFromSocket(socket) {
    const authToken = socket.handshake.auth?.token;

    if (authToken) return authToken;

    const header = socket.handshake.headers?.authorization;

    if (!header) return '';

    return header.split(' ')[1];
}

function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token = getTokenFromSocket(socket);

            if (!token) {
                return next(new Error('Користувач не авторизований'));
            }

            const decoded = jwt.verify(token, secret);

            socket.user = {
                id: decoded.id,
                roles: decoded.roles || [],
            };

            return next();
        } catch (error) {
            return next(new Error('Користувач не авторизований'));
        }
    });

    io.on('connection', (socket) => {
        const userRoom = `user:${socket.user.id}`;

        socket.join(userRoom);

        socket.on('chat:join', async ({ chatId }, callback) => {
            try {
                await getChatForUser(chatId, socket.user.id);

                socket.join(`chat:${chatId}`);

                if (callback) {
                    callback({
                        ok: true,
                    });
                }
            } catch (error) {
                if (callback) {
                    callback({
                        ok: false,
                        message: error.message,
                    });
                }
            }
        });

        socket.on('chat:leave', ({ chatId }) => {
            socket.leave(`chat:${chatId}`);
        });

        socket.on('message:send', async ({ chatId, text }, callback) => {
            try {
                const normalizedText = String(text || '').trim();

                if (!normalizedText) {
                    throw new Error('Повідомлення не може бути порожнім');
                }

                if (normalizedText.length > 1000) {
                    throw new Error('Повідомлення не може бути довшим за 1000 символів');
                }

                const chat = await getChatForUser(chatId, socket.user.id);

                const message = await Message.create({
                    chat: chat._id,
                    sender: socket.user.id,
                    text: normalizedText,
                });

                chat.lastMessageText = normalizedText;
                chat.lastMessageAt = new Date();

                await chat.save();

                const populatedMessage = await Message.findById(message._id).populate({
                    path: 'sender',
                    select: userSelect,
                });

                io.to(`chat:${chatId}`).emit('message:new', {
                    message: populatedMessage,
                });

                const receiverId =
                    String(chat.buyer) === String(socket.user.id)
                        ? String(chat.seller)
                        : String(chat.buyer);

                io.to(`user:${receiverId}`).emit('chat:updated', {
                    chatId: chat._id,
                    lastMessageText: normalizedText,
                    lastMessageAt: chat.lastMessageAt,
                });

                io.to(`user:${socket.user.id}`).emit('chat:updated', {
                    chatId: chat._id,
                    lastMessageText: normalizedText,
                    lastMessageAt: chat.lastMessageAt,
                });

                if (callback) {
                    callback({
                        ok: true,
                        message: populatedMessage,
                    });
                }
            } catch (error) {
                if (callback) {
                    callback({
                        ok: false,
                        message: error.message,
                    });
                }
            }
        });

        socket.on('message:read', async ({ chatId }, callback) => {
            try {
                const chat = await getChatForUser(chatId, socket.user.id);

                await Message.updateMany(
                    {
                        chat: chat._id,
                        sender: { $ne: socket.user.id },
                        isRead: false,
                    },
                    {
                        $set: {
                            isRead: true,
                        },
                    },
                );

                io.to(`chat:${chatId}`).emit('message:read', {
                    chatId,
                    readerId: socket.user.id,
                });

                if (callback) {
                    callback({
                        ok: true,
                    });
                }
            } catch (error) {
                if (callback) {
                    callback({
                        ok: false,
                        message: error.message,
                    });
                }
            }
        });

        socket.on('disconnect', () => {});
    });

    return io;
}

module.exports = initSocket;