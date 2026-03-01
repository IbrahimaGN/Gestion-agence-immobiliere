const visiteService = require('../services/visite.service');
const clientService = require('../services/client.service');
const bienService = require('../services/bien.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { HttpError } = require('../utils/httpError');

/**
 * @desc    Lister toutes les visites
 * @route   GET /api/visites
 */
const getVisites = asyncHandler(async (req, res) => {
  const { clientId, bienId, statut } = req.query;
  
  const filtres = {};
  if (clientId) filtres.clientId = clientId;
  if (bienId) filtres.bienId = bienId;
  if (statut) filtres.statut = statut;
  
  const visites = await visiteService.trouverToutesVisites(filtres);
  sendResponse(res, 200, 'Visites récupérées avec succès', visites);
});

/**
 * @desc    Obtenir une visite par son ID
 * @route   GET /api/visites/:id
 */
const getVisiteById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const visite = await visiteService.trouverVisiteParId(id);
  
  if (!visite) {
    throw new HttpError(404, 'Visite non trouvée');
  }
  
  sendResponse(res, 200, 'Visite récupérée avec succès', visite);
});

/**
 * @desc    Planifier une nouvelle visite
 * @route   POST /api/visites
 */
const createVisite = asyncHandler(async (req, res) => {
  const { clientId, bienId, dateVisite, commentaire } = req.body;
  
  // Vérifier que le client existe
  const client = await clientService.trouverClientParId(clientId);
  if (!client) {
    throw new HttpError(400, `Le client avec l'ID ${clientId} n'existe pas`);
  }
  
  // Vérifier que le bien existe
  const bien = await bienService.trouverBienParId(bienId);
  if (!bien) {
    throw new HttpError(400, `Le bien avec l'ID ${bienId} n'existe pas`);
  }
  
  // Vérifier que le bien est visitable (pas LOUE, VENDU ou ARCHIVE)
  const estVisitable = await bienService.bienEstVisitable(bienId);
  if (!estVisitable) {
    throw new HttpError(
      422,
      `Le bien n'est pas disponible pour une visite (statut: ${bien.statut})`
    );
  }
  
  // Vérifier les doublons
  const doublon = await visiteService.verifierDoublonVisite(clientId, bienId, dateVisite);
  if (doublon) {
    throw new HttpError(409, 'Une visite existe déjà pour ce client, ce bien à cette date');
  }
  
  const visite = await visiteService.planifierVisite({
    clientId: parseInt(clientId),
    bienId: parseInt(bienId),
    dateVisite: new Date(dateVisite),
    commentaire,
    statut: 'DEMANDEE'
  });
  
  sendResponse(res, 201, 'Visite planifiée avec succès', visite);
});

/**
 * @desc    Mettre à jour le statut d'une visite
 * @route   PATCH /api/visites/:id/statut
 */
const updateStatutVisite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { statut, commentaire } = req.body;
  
  // Vérifier que la visite existe
  const visiteExist = await visiteService.trouverVisiteParId(id);
  if (!visiteExist) {
    throw new HttpError(404, 'Visite non trouvée');
  }
  
  const visite = await visiteService.mettreAJourVisite(id, { 
    statut, 
    commentaire: commentaire || visiteExist.commentaire 
  });
  
  sendResponse(res, 200, 'Statut de la visite mis à jour avec succès', visite);
});

/**
 * @desc    Annuler une visite
 * @route   PATCH /api/visites/:id/annuler
 */
const annulerVisite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const visite = await visiteService.annulerVisite(id);
  sendResponse(res, 200, 'Visite annulée avec succès', visite);
});

/**
 * @desc    Confirmer une visite
 * @route   PATCH /api/visites/:id/confirmer
 */
const confirmerVisite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const visite = await visiteService.confirmerVisite(id);
  sendResponse(res, 200, 'Visite confirmée avec succès', visite);
});

/**
 * @desc    Marquer une visite comme effectuée
 * @route   PATCH /api/visites/:id/effectuer
 */
const effectuerVisite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const visite = await visiteService.effectuerVisite(id);
  sendResponse(res, 200, 'Visite marquée comme effectuée avec succès', visite);
});

/**
 * @desc    Supprimer une visite
 * @route   DELETE /api/visites/:id
 */
const deleteVisite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que la visite existe
  const visite = await visiteService.trouverVisiteParId(id);
  if (!visite) {
    throw new HttpError(404, 'Visite non trouvée');
  }
  
  await visiteService.supprimerVisite(id);
  sendResponse(res, 200, 'Visite supprimée avec succès');
});

module.exports = {
  getVisites,
  getVisiteById,
  createVisite,
  updateStatutVisite,
  annulerVisite,
  confirmerVisite,
  effectuerVisite,
  deleteVisite
};