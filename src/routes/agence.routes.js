
const express = require('express');
const agenceController = require('../controllers/agence.controller');
const valider = require('../middlewares/validate');
const { schemaCreerAgence, schemaMettreAJourAgence } = require('../validation/agence.schema');

const router = express.Router();

router.get('/', agenceController.getAgences);
router.get('/:id', agenceController.getAgenceById);
router.post('/', valider(schemaCreerAgence), agenceController.createAgence);
router.put('/:id', valider(schemaMettreAJourAgence), agenceController.updateAgence);
router.delete('/:id', agenceController.deleteAgence);

module.exports = router;