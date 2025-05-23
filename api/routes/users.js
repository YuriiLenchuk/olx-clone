const express = require('express');
const { getUsers, addUser, deleteUser } = require('../controllers/users.controller');

const router = express.Router();

module.exports = router;
