const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route de connexion
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;