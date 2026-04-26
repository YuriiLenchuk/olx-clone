// seed_categories.js

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Category = require('../models/category_model');
const mongoURI = require('../mongo');

const categories = [
    { name: 'Дитячий Одяг', path: 'dytyachyi-odyag' },
    { name: 'Іграшки', path: 'igrashky' },
    { name: 'Квартири', path: 'kvartyry' },
    { name: 'Будинки', path: 'budynky' },
    { name: 'Легкові автомобілі', path: 'legkovi-avtomobili' },
    { name: 'Мото', path: 'moto' },
    { name: 'Автозапчастини', path: 'avtozapchastyny' },
    { name: 'Аксесуари', path: 'aksesuary' },
    { name: 'ІТ / комп\'ютери', path: 'it-komputery' },
    { name: 'Логістика', path: 'lohistyka' },
    { name: 'Собаки', path: 'sobaky' },
    { name: 'Коти', path: 'koty' },
    { name: 'Меблі', path: 'mebli' },
    { name: 'Сад / город', path: 'sad-horod' },
    { name: 'Телефони', path: 'telefony' },
    { name: 'Побутова техніка', path: 'pobutova-tehnika' },
    { name: 'Краса / здоров\'я', path: 'krasa-zdorovya' },
    { name: 'Клінінг', path: 'klining' },
    { name: 'Оренда транспорту', path: 'orenda-transportu' },
    { name: 'Оренда обладнання', path: 'orenda-obladnannya' },
    { name: 'Жіночий одяг', path: 'zhinochyi-odyag' },
    { name: 'Чоловічий одяг', path: 'cholovichyi-odyag' },
    { name: 'Музичні інструменти', path: 'muzychni-instrumenty' },
    { name: 'Спорт / відпочинок', path: 'sport-vidpochynok' },

    {
        name: 'Дитячий світ',
        path: 'dytyachyi-svit',
        imagePath: path.join(__dirname, '../assets/detskiy-mir.png'),
        subcategoryNames: ['Дитячий Одяг', 'Іграшки'],
    },
    {
        name: 'Нерухомість',
        path: 'nerukhomist',
        imagePath: path.join(__dirname, '../assets/nedvizhimost.png'),
        subcategoryNames: ['Квартири', 'Будинки'],
    },
    {
        name: 'Авто',
        path: 'avto',
        imagePath: path.join(__dirname, '../assets/transport.png'),
        subcategoryNames: ['Легкові автомобілі', 'Мото'],
    },
    {
        name: 'Запчастини для транспорту',
        path: 'zapchastyny-dlia-transportu',
        imagePath: path.join(__dirname, '../assets/zapchasti-dlya-transporta.png'),
        subcategoryNames: ['Автозапчастини', 'Аксесуари'],
    },
    {
        name: 'Робота',
        path: 'robota',
        imagePath: path.join(__dirname, '../assets/rabota.png'),
        subcategoryNames: ['ІТ / комп\'ютери', 'Логістика'],
    },
    {
        name: 'Тварини',
        path: 'tvaryny',
        imagePath: path.join(__dirname, '../assets/zhivotnye.png'),
        subcategoryNames: ['Собаки', 'Коти'],
    },
    {
        name: 'Дім і сад',
        path: 'dim-i-sad',
        imagePath: path.join(__dirname, '../assets/dom-i-sad.png'),
        subcategoryNames: ['Меблі', 'Сад / город'],
    },
    {
        name: 'Електроніка',
        path: 'elektronika',
        imagePath: path.join(__dirname, '../assets/elektronika.png'),
        subcategoryNames: ['Телефони', 'Побутова техніка'],
    },
    {
        name: 'Бізнес та послуги',
        path: 'biznes-ta-poslugy',
        imagePath: path.join(__dirname, '../assets/uslugi.png'),
        subcategoryNames: ['Краса / здоров\'я', 'Клінінг'],
    },
    {
        name: 'Житло подобово',
        path: 'zhytlo-podobovo',
        imagePath: path.join(__dirname, '../assets/zhytlo-podobovo.png'),
        subcategoryNames: ['Квартири', 'Будинки'],
    },
    {
        name: 'Оренда та прокат',
        path: 'orenda-ta-prokat',
        imagePath: path.join(__dirname, '../assets/arenda-prokat.png'),
        subcategoryNames: ['Оренда транспорту', 'Оренда обладнання'],
    },
    {
        name: 'Мода і стиль',
        path: 'moda-i-styl',
        imagePath: path.join(__dirname, '../assets/moda-i-stil.png'),
        subcategoryNames: ['Жіночий одяг', 'Чоловічий одяг'],
    },
    {
        name: 'Хоббі, відпочинок і спорт',
        path: 'hobbi-vidpochynok-i-sport',
        imagePath: path.join(__dirname, '../assets/hobbi-otdyh-i-sport.png'),
        subcategoryNames: ['Музичні інструменти', 'Спорт / відпочинок'],
    },
    {
        name: 'Віддам безкоштвоно',
        path: 'viddam-bezkoshtovno',
        imagePath: path.join(__dirname, '../assets/otdam-darom.png'),
        subcategoryNames: [],
    },
    {
        name: 'Обмін',
        path: 'obmin',
        imagePath: path.join(__dirname, '../assets/obmen-barter.png'),
        subcategoryNames: [],
    },
    {
        name: 'Товари для геймерів',
        path: 'tovary-dlia-heimeriv',
        imagePath: path.join(__dirname, '../assets/cybersport.png'),
        subcategoryNames: [],
    },
    {
        name: 'Все про OLX для бізнесу',
        path: 'olx-dlia-biznesu',
        imagePath: path.join(__dirname, '../assets/olx_business.png'),
        subcategoryNames: [],
    },
    {
        name: 'Запчастини з Польщі',
        path: 'zapchastyny-z-polshchi',
        imagePath: path.join(__dirname, '../assets/olx_parts.png'),
        subcategoryNames: [],
    },
];

const seed = async () => {
    try {
        await mongoose.connect(mongoURI);
        const { db } = mongoose.connection;
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
        await Category.deleteMany({});

        const nameToId = new Map();

        // eslint-disable-next-line no-restricted-syntax
        for (const category of categories) {
            const { name, path: slug, imagePath } = category;
            let photoFilename = null;

            if (imagePath) {
                photoFilename = path.basename(imagePath);

                // eslint-disable-next-line no-await-in-loop
                const exists = await db
                    .collection('uploads.files')
                    .findOne({ filename: photoFilename });
                if (!exists) {
                    // eslint-disable-next-line no-await-in-loop
                    await new Promise((resolve, reject) => {
                        fs.createReadStream(imagePath)
                            .pipe(bucket.openUploadStream(photoFilename))
                            .on('error', reject)
                            .on('finish', () => {
                                console.log(`✅ Image uploaded: ${photoFilename}`);
                                resolve();
                            });
                    });
                }
            }

            // eslint-disable-next-line no-await-in-loop
            const doc = await Category.create({ name, path: slug, photoFilename });
            // eslint-disable-next-line no-underscore-dangle
            nameToId.set(name, doc._id);
        }

        // Додати підкатегорії
        // eslint-disable-next-line no-restricted-syntax
        for (const category of categories) {
            const { subcategoryNames = [] } = category;
            // eslint-disable-next-line no-continue
            if (!subcategoryNames.length) continue;

            const parentId = nameToId.get(category.name);
            const subcategoryIds = subcategoryNames.map(name => nameToId.get(name)).filter(Boolean);

            // eslint-disable-next-line no-await-in-loop
            await Category.findByIdAndUpdate(parentId, {
                $set: { subcategories: subcategoryIds },
            });

            console.log(`🔗 Subcategories linked for: ${category.name}`);
        }

        console.log('✅ Category seeding complete');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
};

seed();
