const express = require('express');

const {
    createOrGetChat,
    getMyChats,
    getChatById,
    markChatAsRead,
} = require('../controllers/chat.controller');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getMyChats);

router.post('/', authMiddleware, createOrGetChat);

router.get('/:id', authMiddleware, getChatById);

router.patch('/:id/read', authMiddleware, markChatAsRead);

module.exports = router;
