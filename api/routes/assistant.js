const express = require('express');
const rateLimit = require('express-rate-limit');
const { askAssistant } = require('../controllers/assistant.controller');

const router = express.Router();

const assistantLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: process.env.NODE_ENV === 'production' ? 12 : 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Забагато запитів до консультанта. Спробуйте ще раз трохи пізніше.',
    },
});

router.post('/ask', assistantLimiter, askAssistant);

module.exports = router;
