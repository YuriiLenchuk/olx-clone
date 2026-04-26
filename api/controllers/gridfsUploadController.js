const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
const mongoose = require('mongoose');
const fs = require('fs');

const conn = mongoose.connection;

// eslint-disable-next-line consistent-return
async function uploadToGridFS(req, res, next) {
    try {
        req.body.img = [];
        const { files } = req;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Файли не надіслані' });
        }

        const invalid = files.find(
            file => !['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype),
        );

        if (invalid) {
            return res.status(400).json({ error: `Невірний тип файлу: ${invalid.originalname}` });
        }

        // Ініціалізуємо GridFSBucket (за замовчуванням collection 'fs')
        const bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });

        files.map(async file => {
            const dateObj = new Date();
            const date = `${dateObj.getDate()}${
                dateObj.getMonth() + 1
            }${dateObj.getFullYear()}${dateObj.getHours()}${dateObj.getMinutes()}`;
            req.body.img.push((date + file.originalname).toString());
            await new Promise((resolve, reject) => {
                const readableStream = Readable.from(file.buffer);
                readableStream
                    .pipe(bucket.openUploadStream(date + file.originalname))
                    .on('error', reject)
                    .on('finish', () => {
                        console.log(`✅ Image uploaded: ${file.originalname}`);
                        resolve();
                    });
            });
        });

        next();
    } catch (err) {
        console.error('GridFS помилка:', err);
        res.status(500).json({ error: 'Помилка при завантаженні файлів' });
    }
}

module.exports = uploadToGridFS;
