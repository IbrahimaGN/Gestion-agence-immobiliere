const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes pour les administrateurs uniquement
router.post('/', authorize('ADMIN'), upload.single('imageUrl'), clientController.createClient);
router.put('/:id', authorize('ADMIN'), upload.single('imageUrl'), clientController.updateClient);
router.delete('/:id', authorize('ADMIN'), clientController.deleteClient);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientById);

module.exports = router;