const agenceService = require('../services/agence.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { HttpError } = require('../utils/httpError');


// méthode pour récupérer toutes les agences
const getAgences = asyncHandler(async (req, res) => {
  const agences = await agenceService.trouverToutesAgences();
  sendResponse(res, 200, 'Agences récupérées avec succès', agences);
});


// méthode pour récupérer une agence par son ID
const getAgenceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const agence = await agenceService.trouverAgenceParId(id);
  
  if (!agence) {
    throw new HttpError(404, 'Agence non trouvée');
  }
  
  sendResponse(res, 200, 'Agence récupérée avec succès', agence);
});


// méthode pour créer une nouvelle agence
const createAgence = asyncHandler(async (req, res) => {
  const { code, nom, adresse } = req.body;
  
  
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


// méthode pour mettre à jour une agence existante
const updateAgence = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nom, adresse, code } = req.body;
  
  const agenceExistante = await agenceService.trouverAgenceParId(id);
  if (!agenceExistante) {
    throw new HttpError(404, 'Agence non trouvée');
  }
  
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


// méthode pour supprimer une agence
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