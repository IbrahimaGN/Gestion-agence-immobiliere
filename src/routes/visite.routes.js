const express = require('express');
const router = express.Router();
const visiteController = require('../controllers/visite.controller');
const { authenticate, authorize } = require('../middlewares/auth');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes pour les administrateurs
router.patch('/:id/statut', authorize('ADMIN'), visiteController.updateStatutVisite);
router.patch('/:id/annuler', authorize('ADMIN'), visiteController.annulerVisite);
router.patch('/:id/confirmer', authorize('ADMIN'), visiteController.confirmerVisite);
router.patch('/:id/effectuer', authorize('ADMIN'), visiteController.effectuerVisite);
router.delete('/:id', authorize('ADMIN'), visiteController.deleteVisite);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', visiteController.getVisites);
router.get('/:id', visiteController.getVisiteById);
router.post('/', visiteController.createVisite);

module.exports = router;