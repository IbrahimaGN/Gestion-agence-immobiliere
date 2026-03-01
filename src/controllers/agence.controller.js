const agenceService = require('../services/agence.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { HttpError } = require('../utils/httpError');

/**
 * @desc    Lister toutes les agences
 * @route   GET /api/agences
 */
const getAgences = asyncHandler(async (req, res) => {
  const agences = await agenceService.trouverToutesAgences();
  sendResponse(res, 200, 'Agences récupérées avec succès', agences);
});

/**
 * @desc    Obtenir une agence par son ID
 * @route   GET /api/agences/:id
 */
const getAgenceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const agence = await agenceService.trouverAgenceParId(id);
  
  if (!agence) {
    throw new HttpError(404, 'Agence non trouvée');
  }
  
  sendResponse(res, 200, 'Agence récupérée avec succès', agence);
});


/**
 * @desc    Créer une nouvelle agence
 * @route   POST /api/agences
 */
const createAgence = asyncHandler(async (req, res) => {
  const { code, nom, adresse } = req.body;
  
  // Vérifier si le code existe déjà
  const existant = await agenceService.trouverAgenceParCode(code);
  if (existant) {
    throw new HttpError(409, `Une agence avec le code ${code} existe déjà`);
  }
  
  const agence = await agenceService.creerAgence({
    code,
    nom,
    adresse
  });
  
  sendResponse(res, 201, 'Agence créée avec succès', agence);
});

/**
 * @desc    Modifier une agence
 * @route   PUT /api/agences/:id
 */
const updateAgence = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nom, adresse, code } = req.body;
  
  // Vérifier que l'agence existe
  const agenceExistante = await agenceService.trouverAgenceParId(id);
  if (!agenceExistante) {
    throw new HttpError(404, 'Agence non trouvée');
  }
  
  // Si le code est modifié, vérifier son unicité
  if (code && code !== agenceExistante.code) {
    const codeExistant = await agenceService.trouverAgenceParCode(code);
    if (codeExistant) {
      throw new HttpError(409, `Une agence avec le code ${code} existe déjà`);
    }
  }
  
  const agence = await agenceService.mettreAJourAgence(id, {
    code,
    nom,
    adresse
  });
  
  sendResponse(res, 200, 'Agence mise à jour avec succès', agence);
});

/**
 * @desc    Supprimer une agence
 * @route   DELETE /api/agences/:id
 */
const deleteAgence = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que l'agence existe
  const agence = await agenceService.trouverAgenceParId(id);
  if (!agence) {
    throw new HttpError(404, 'Agence non trouvée');
  }
  
  // Vérifier si l'agence a des relations
  const { aDesRelations, clients, biens } = await agenceService.agenceADesRelations(id);
  
  if (aDesRelations) {
    throw new HttpError(
      409,
      `Impossible de supprimer : l'agence a ${clients} client(s) et ${biens} bien(s) liés`
    );
  }
  
  await agenceService.supprimerAgence(id);
  sendResponse(res, 200, 'Agence supprimée avec succès');
});

module.exports = {
  getAgences,
  getAgenceById,
  createAgence,
  updateAgence,
  deleteAgence
};