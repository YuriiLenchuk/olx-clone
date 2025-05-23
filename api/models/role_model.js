const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    value: { type: String, default: 'USER' },
});

module.exports = mongoose.model('Role', RoleSchema);
