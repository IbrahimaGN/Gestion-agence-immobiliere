const express = require('express');
const router = express.Router();
const bienController = require('../controllers/bien.controller');
const { authenticate, authorize } = require('../middlewares/auth');

// Routes publiques (catalogue)
router.get('/catalogue', bienController.getCatalogue);
router.get('/catalogue/:id', bienController.getBienById);

// Routes protégées
router.use(authenticate);

// Routes pour les administrateurs uniquement
router.post('/', authorize('ADMIN'), bienController.createBien);
router.put('/:id', authorize('ADMIN'), bienController.updateBien);
router.patch('/:id/archiver', authorize('ADMIN'), bienController.archiveBien);
router.delete('/:id', authorize('ADMIN'), bienController.deleteBien);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', bienController.getBiens);
router.get('/:id', bienController.getBienById);

module.exports = router;