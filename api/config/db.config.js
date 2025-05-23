const mongoose = require('mongoose');
const str = require('../mongo');
console.log(str);

async function connectToDb() {
    await mongoose.connect(str);
}

mongoose.connection.on('error', err => {
    console.log(err);
});

module.exports = () =>
    connectToDb()
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch(console.log);
