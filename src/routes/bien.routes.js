
const express = require('express');
const bienController = require('../controllers/bien.controller');
const valider = require('../middlewares/validate');
const { schemaCreerBien, schemaMettreAJourBien } = require('../validation/bien.schema');

const router = express.Router();

router.get('/catalogue', bienController.getCatalogue);
router.get('/', bienController.getBiens);
router.get('/:id', bienController.getBienById);
router.post('/', valider(schemaCreerBien), bienController.createBien);
router.put('/:id', valider(schemaMettreAJourBien), bienController.updateBien);
router.delete('/:id', bienController.deleteBien);
router.patch('/:id/archiver', bienController.archiveBien);

module.exports = router;