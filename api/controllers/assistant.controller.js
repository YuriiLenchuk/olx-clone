const { askMarketplaceAssistant } = require('../services/assistant.service');

const normalizeHistory = history => {
    if (!Array.isArray(history)) return [];

    return history
        .slice(-6)
        .map(message => ({
            role: message?.role === 'assistant' ? 'assistant' : 'user',
            content: String(message?.content || '').trim().slice(0, 500),
        }))
        .filter(message => message.content);
};

const askAssistant = async (req, res) => {
    try {
        const message = String(req.body?.message || '').trim();

        if (!message) {
            return res.status(400).json({
                message: 'Поле message є обовʼязковим',
            });
        }

        if (message.length > 1000) {
            return res.status(400).json({
                message: 'Повідомлення занадто довге',
            });
        }

        const result = await askMarketplaceAssistant({
            message,
            history: normalizeHistory(req.body?.history),
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.publicMessage || 'Помилка при зверненні до AI-консультанта',
            error: error.message,
        });
    }
};

module.exports = {
    askAssistant,
};