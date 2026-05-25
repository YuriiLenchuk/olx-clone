const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const dns = require('dns');
const mongoURI = require('../mongo');

let gfs;

dns.setServers(['8.8.8.8', '1.1.1.1']);

async function connectToDb() {
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('error', err => {
        console.log('MongoDB connection error:', err);
    });

    function initializeGridFS() {
        gfs = Grid(db.db, mongoose.mongo);
        gfs.collection('uploads');
        console.log('GridFS initialized');
    }

    if (db.readyState === 1) {
        initializeGridFS();
    } else {
        db.once('open', initializeGridFS);
    }
}

module.exports = {
    connectToDb: () =>
        connectToDb()
            .then(() => console.log('MongoDB connected'))
            .catch(console.error),
    getGfs: async () => gfs,
};
