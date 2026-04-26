const { GridFSBucket, ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const conn = mongoose.connection;

const getImg = async (req, res) => {
    try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads',
        });

        const fileStream = bucket.openDownloadStreamByName(req.params.filename);
        fileStream.on('error', () => res.status(400).send('Image not found'));
        fileStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

async function deleteImg(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Невірний ID файлу' });
        }

        const bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });

        await bucket.delete(new ObjectId(id));

        return res.status(200).json({ message: 'Файл успішно видалено' });
    } catch (err) {
        if (err.code === 'ENOENT' || err.message.includes('FileNotFound')) {
            return res.status(404).json({ error: 'Файл не знайдено' });
        }

        console.error('Помилка при видаленні файлу:', err);
        return res.status(500).json({ error: 'Помилка сервера при видаленні' });
    }
}

async function deleteImgs(req, res) {
    try {
        const { ids } = req.body;

        // eslint-disable-next-line consistent-return
        ids.map(async id => {
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Невірний ID файлу' });
            }

            const bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });

            await bucket.delete(new ObjectId(id));
        });

        return res.status(200).json({ message: 'Файли успішно видалено' });
    } catch (err) {
        if (err.code === 'ENOENT' || err.message.includes('FileNotFound')) {
            return res.status(404).json({ error: 'Файл не знайдено' });
        }

        console.error('Помилка при видаленні файлу:', err);
        return res.status(500).json({ error: 'Помилка сервера при видаленні' });
    }
}

module.exports = { getImg, deleteImg, deleteImgs };
