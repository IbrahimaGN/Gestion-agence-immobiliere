
const express = require('express');
const visiteController = require('../controllers/visite.controller');
const valider = require('../middlewares/validate');
const { schemaCreerVisite, schemaMettreAJourVisite } = require('../validation/visite.schema');

const router = express.Router();

router.get('/', visiteController.getVisites);
router.get('/:id', visiteController.getVisiteById);
router.post('/', valider(schemaCreerVisite), visiteController.createVisite);
router.patch('/:id/statut', valider(schemaMettreAJourVisite), visiteController.updateStatutVisite);
router.patch('/:id/annuler', visiteController.annulerVisite);
router.patch('/:id/confirmer', visiteController.confirmerVisite);
router.patch('/:id/effectuer', visiteController.effectuerVisite);
router.delete('/:id', visiteController.deleteVisite);

module.exports = router;