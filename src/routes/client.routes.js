
const express = require('express');
const clientController = require('../controllers/client.controller');
const valider = require('../middlewares/validate');
const { schemaCreerClient, schemaMettreAJourClient } = require('../validation/client.schema');
const {uploadImage} = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientById);
router.post('/', uploadImage, valider(schemaCreerClient), clientController.createClient);
router.put('/:id', uploadImage, valider(schemaMettreAJourClient), clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;