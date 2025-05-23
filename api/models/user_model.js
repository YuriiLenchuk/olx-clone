const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    roles: [{ type: String, ref: 'Role' }],
});

module.exports = mongoose.model('User', UserSchema);
