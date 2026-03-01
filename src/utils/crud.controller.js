const asyncHandler = require('./asyncHandler');
const { repondreSucces, repondreCreation } = require('./response');

// Génère un contrôleur CRUD générique pour un service donné
const creerControleurCrud = (service, nom) => ({
  creerTout: asyncHandler(async (req, res) => {
    const items = await service.recupererTout(req.query);
    repondreSucces(res, items, `Liste des ${nom} récupérée`);
  }),

  creerUn: asyncHandler(async (req, res) => {
    const item = await service.recupererParId(req.params.id);
    repondreSucces(res, item, `${nom} récupéré`);
  }),

  creerNouveau: asyncHandler(async (req, res) => {
    const item = await service.creer(req.body);
    repondreCreation(res, item, `${nom} créé avec succès`);
  }),

  mettreAJour: asyncHandler(async (req, res) => {
    const item = await service.mettreAJour(req.params.id, req.body);
    repondreSucces(res, item, `${nom} mis à jour`);
  }),

  supprimer: asyncHandler(async (req, res) => {
    await service.supprimer(req.params.id);
    repondreSucces(res, null, `${nom} supprimé`);
  }),
});

module.exports = creerControleurCrud;
