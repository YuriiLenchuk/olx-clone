const express = require('express');
const rateLimit = require('express-rate-limit');
const { askAssistant } = require('../controllers/assistant.controller');

const router = express.Router();

const assistantLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 8,
    message: {
        message: 'Забагато запитів до консультанта. Спробуйте ще раз трохи пізніше.',
    },
});

router.post('/ask', assistantLimiter, askAssistant);

module.exports = router;