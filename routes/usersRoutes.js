const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController.js');

router.post('/update-balance', usersController.updateBalance);

module.exports = router;