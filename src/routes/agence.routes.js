
const express = require('express');
const router = express.Router();
const agenceController = require('../controllers/agence.controller');
const { authenticate, authorize } = require('../middlewares/auth');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes pour les administrateurs uniquement
router.post('/', authorize('ADMIN'), agenceController.createAgence);
router.put('/:id', authorize('ADMIN'), agenceController.updateAgence);
router.delete('/:id', authorize('ADMIN'), agenceController.deleteAgence);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', agenceController.getAgences);
router.get('/:id', agenceController.getAgenceById);

module.exports = router;