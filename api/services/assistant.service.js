const Item = require('../models/item_model');

const DEFAULT_MODEL = 'gemini-3.5-flash';

let geminiClient = null;

const STOP_WORDS = new Set([
    'мені',
    'мене',
    'потрібно',
    'треба',
    'порадь',
    'порекомендуй',
    'знайди',
    'покажи',
    'купити',
    'куплю',
    'товар',
    'товари',
    'оголошення',
    'для',
    'про',
    'або',
    'але',
    'щоб',
    'який',
    'яка',
    'яке',
    'які',
    'що',
    'чи',
    'до',
    'від',
    'грн',
    'uah',
    'новий',
    'нова',
    'б/у',
    'бу',
]);

const WEB_SEARCH_HINTS = [
    'в інтернеті',
    'google',
    'гугл',
    'актуальн',
    'новин',
    'характеристик',
    'відгук',
    'огляд',
    'порівняй',
    'порівняти',
    'чи варто',
    'ринкова ціна',
    'скільки коштує новий',
];

const escapeRegExp = value => {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const trimText = (value, maxLength = 240) => {
    const text = String(value || '').replace(/\s+/g, ' ').trim();

    if (text.length <= maxLength) return text;

    return `${text.slice(0, maxLength - 1).trim()}…`;
};

const tokenize = message => {
    return String(message || '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
        .split(/\s+/)
        .map(token => token.trim())
        .filter(token => token.length > 2)
        .filter(token => !STOP_WORDS.has(token))
        .slice(0, 12);
};

const parseMaxPrice = message => {
    const match = String(message || '').match(
        /(?:до|менше|нижче|не дорожче|максимум)\s+(\d[\d\s]*)/i,
    );

    if (!match) return null;

    const price = Number(match[1].replace(/\s/g, ''));

    return Number.isFinite(price) && price > 0 ? price : null;
};

const shouldUseWebSearch = message => {
    if (process.env.GEMINI_ENABLE_GOOGLE_SEARCH !== 'true') return false;

    const normalizedMessage = String(message || '').toLowerCase();

    return WEB_SEARCH_HINTS.some(hint => normalizedMessage.includes(hint));
};

const getGeminiClient = async () => {
    if (!process.env.GEMINI_API_KEY) {
        const error = new Error('GEMINI_API_KEY не налаштований');
        error.status = 503;
        error.publicMessage = 'AI-консультант ще не налаштований на сервері';
        throw error;
    }

    if (!geminiClient) {
        const { GoogleGenAI } = await import('@google/genai');

        geminiClient = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
    }

    return geminiClient;
};

const toAssistantItem = item => {
    const id = String(item._id);

    return {
        id,
        title: item.name,
        price: item.price,
        location: item.location,
        condition: item.isNewState ? 'Новий' : 'Вживаний',
        category: item.categoryData?.category || '',
        subcategory: item.categoryData?.subcategory || '',
        description: trimText(item.description, 260),
        image: Array.isArray(item.img) ? item.img[0] || null : null,
        url: `/obyava/${id}`,
    };
};

const findRelevantItems = async message => {
    const tokens = tokenize(message);
    const maxPrice = parseMaxPrice(message);

    const filter = {
        isArchived: { $ne: true },
    };

    if (maxPrice) {
        filter.price = { $lte: maxPrice };
    }

    if (tokens.length) {
        filter.$or = tokens.flatMap(token => {
            const regex = new RegExp(escapeRegExp(token), 'i');

            return [
                { name: regex },
                { description: regex },
                { location: regex },
                { 'categoryData.category': regex },
                { 'categoryData.subcategory': regex },
            ];
        });
    }

    let items = await Item.find(filter)
        .sort({ date: -1 })
        .select('name img description price isNewState location categoryData date')
        .limit(12)
        .lean();

    let wasFallback = false;

    if (!items.length) {
        wasFallback = true;

        items = await Item.find({ isArchived: { $ne: true } })
            .sort({ date: -1 })
            .select('name img description price isNewState location categoryData date')
            .limit(8)
            .lean();
    }

    return {
        items: items.map(toAssistantItem),
        wasFallback,
    };
};

const buildHistoryText = history => {
    if (!history.length) return 'Історії діалогу немає.';

    return history
        .map(message => {
            const role = message.role === 'assistant' ? 'Асистент' : 'Користувач';

            return `${role}: ${message.content}`;
        })
        .join('\n');
};

const buildCatalogText = items => {
    if (!items.length) return 'Доступних товарів зараз немає.';

    return items
        .map((item, index) => {
            return [
                `[${index + 1}]`,
                `id: ${item.id}`,
                `назва: ${item.title}`,
                `ціна: ${item.price} грн`,
                `місто: ${item.location}`,
                `стан: ${item.condition}`,
                `категорія: ${item.category}${item.subcategory ? ` / ${item.subcategory}` : ''}`,
                `опис: ${item.description}`,
                `url: ${item.url}`,
            ].join('\n');
        })
        .join('\n\n');
};

const buildPrompt = ({ message, history, items, wasFallback, useGoogleSearch }) => {
    return `
Ти AI-консультант маркетплейсу Local Market.

Твоє завдання:
- відповідати українською;
- допомагати користувачу знайти товар;
- радити тільки товари зі списку "Доступні товари";
- не вигадувати id, url, ціни, міста або характеристики товарів;
- якщо точних товарів немає, чесно скажи це і запропонуй найближчі варіанти;
- якщо користувач питає про актуальні характеристики, ринкову ціну або зовнішню інформацію, ${useGoogleSearch ? 'можеш використати Google Search.' : 'скажи, що можеш орієнтуватися лише на товари з сайту.'}

Формат відповіді:
Поверни тільки валідний JSON без markdown.

JSON-схема:
{
  "answer": "коротка корисна відповідь для користувача",
  "items": [
    {
      "id": "id товару зі списку",
      "title": "назва товару",
      "url": "/obyava/id",
      "reason": "чому цей товар підходить"
    }
  ]
}

Історія діалогу:
${buildHistoryText(history)}

Доступні товари:
${wasFallback ? 'Точних збігів не знайдено, нижче останні доступні товари.\n' : ''}
${buildCatalogText(items)}

Питання користувача:
${message}
`.trim();
};

const extractJson = text => {
    const rawText = String(text || '').trim();
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) return null;

    try {
        return JSON.parse(rawText.slice(start, end + 1));
    } catch {
        return null;
    }
};

const normalizeAssistantItems = (itemsFromModel, catalogItems) => {
    const catalogById = new Map(catalogItems.map(item => [item.id, item]));

    if (!Array.isArray(itemsFromModel)) return [];

    return itemsFromModel
        .map(item => {
            const id = String(item?.id || '');
            const catalogItem = catalogById.get(id);

            if (!catalogItem) return null;

            return {
                id,
                title: catalogItem.title,
                url: catalogItem.url,
                reason: trimText(item?.reason || 'Підходить під ваш запит.', 160),
                price: catalogItem.price,
                location: catalogItem.location,
                image: catalogItem.image,
            };
        })
        .filter(Boolean)
        .slice(0, 4);
};

const getFallbackAnswer = catalogItems => {
    if (!catalogItems.length) {
        return {
            answer: 'Зараз немає доступних товарів, які я можу порекомендувати.',
            items: [],
        };
    }

    return {
        answer: 'Я знайшов кілька доступних товарів, які можуть підійти. Можеш відкрити деталі будь-якого з них.',
        items: catalogItems.slice(0, 3).map(item => ({
            id: item.id,
            title: item.title,
            url: item.url,
            reason: 'Найближчий доступний варіант у каталозі.',
            price: item.price,
            location: item.location,
            image: item.image,
        })),
    };
};

const getGrounding = response => {
    const metadata = response?.candidates?.[0]?.groundingMetadata;
    const chunks = metadata?.groundingChunks || [];

    const sources = chunks
        .map(chunk => chunk.web)
        .filter(Boolean)
        .map(source => ({
            title: source.title || source.uri,
            uri: source.uri,
        }))
        .filter(source => source.uri)
        .slice(0, 5);

    return {
        usedWeb: Boolean(metadata?.webSearchQueries?.length || sources.length),
        queries: metadata?.webSearchQueries || [],
        sources,
        searchEntryPoint: metadata?.searchEntryPoint?.renderedContent || null,
    };
};

const askMarketplaceAssistant = async ({ message, history = [] }) => {
    const { items, wasFallback } = await findRelevantItems(message);

    if (!items.length) {
        return {
            answer: 'Зараз у каталозі немає доступних товарів, які я можу порекомендувати.',
            items: [],
            grounding: {
                usedWeb: false,
                queries: [],
                sources: [],
                searchEntryPoint: null,
            },
        };
    }

    const ai = await getGeminiClient();
    const useGoogleSearch = shouldUseWebSearch(message);

    const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
        contents: buildPrompt({
            message,
            history,
            items,
            wasFallback,
            useGoogleSearch,
        }),
        config: {
            temperature: 0.35,
            ...(useGoogleSearch ? { tools: [{ googleSearch: {} }] } : {}),
        },
    });

    const parsed = extractJson(response.text);
    const fallback = getFallbackAnswer(items);
    const answer = trimText(parsed?.answer || response.text || fallback.answer, 1200);
    const assistantItems = normalizeAssistantItems(parsed?.items, items);

    return {
        answer,
        items: assistantItems.length ? assistantItems : fallback.items,
        grounding: getGrounding(response),
    };
};

module.exports = {
    askMarketplaceAssistant,
};