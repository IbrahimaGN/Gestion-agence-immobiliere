const bienService = require('../services/bien.service');
const agenceService = require('../services/agence.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { HttpError } = require('../utils/httpError');

// méthode pour récupérer le catalogue de biens disponibles
const getCatalogue = asyncHandler(async (req, res) => {
  const { type, statut, prixMin, prixMax } = req.query;
  
  const filtres = {
    catalogue: true,
    type,
    statut,
    prixMin: prixMin ? parseFloat(prixMin) : undefined,
    prixMax: prixMax ? parseFloat(prixMax) : undefined
  };
  
  const biens = await bienService.trouverTousBiens(filtres);
  sendResponse(res, 200, 'Catalogue récupéré avec succès', biens);
});


// méthode pour récupérer tous les biens avec des filtres optionnels
const getBiens = asyncHandler(async (req, res) => {
  const { type, statut, agenceId, prixMin, prixMax } = req.query;
  
  const filtres = {
    type,
    statut,
    agenceId,
    prixMin: prixMin ? parseFloat(prixMin) : undefined,
    prixMax: prixMax ? parseFloat(prixMax) : undefined
  };
  
  const biens = await bienService.trouverTousBiens(filtres);
  sendResponse(res, 200, 'Biens récupérés avec succès', biens);
});


// méthode pour récupérer un bien par son ID
const getBienById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bien = await bienService.trouverBienParId(id);
  
  if (!bien) {
    throw new HttpError(404, 'Bien non trouvé');
  }
  
  sendResponse(res, 200, 'Bien récupéré avec succès', bien);
});


// méthode pour créer un nouveau bien
const createBien = asyncHandler(async (req, res) => {
  const { titre, type, adresse, prix, statut, agenceId } = req.body;
  
  // Vérifier que l'agence existe
  const agence = await agenceService.trouverAgenceParId(agenceId);
  if (!agence) {
    throw new HttpError(400, `L'agence avec l'ID ${agenceId} n'existe pas`);
  }
  
  const bien = await bienService.creerBien({
    titre,
    type,
    adresse,
    prix: parseFloat(prix),
    statut: statut || 'DISPONIBLE',
    agenceId: parseInt(agenceId)
  });
  
  sendResponse(res, 201, 'Bien créé avec succès', bien);
});

// méthode pour mettre à jour un bien existant
const updateBien = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titre, type, adresse, prix, statut, agenceId } = req.body;
  
  // Vérifier que le bien existe
  const bienExist = await bienService.trouverBienParId(id);
  if (!bienExist) {
    throw new HttpError(404, 'Bien non trouvé');
  }
  
  // Si l'agenceId est modifié, vérifier que l'agence existe
  if (agenceId) {
    const agence = await agenceService.trouverAgenceParId(agenceId);
    if (!agence) {
      throw new HttpError(400, `L'agence avec l'ID ${agenceId} n'existe pas`);
    }
  }
  
  const bien = await bienService.mettreAJourBien(id, {
    titre,
    type,
    adresse,
    prix: prix ? parseFloat(prix) : undefined,
    statut,
    agenceId: agenceId ? parseInt(agenceId) : undefined
  });
  
  sendResponse(res, 200, 'Bien mis à jour avec succès', bien);
});

// méthode pour supprimer un bien
const deleteBien = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que le bien existe
  const bien = await bienService.trouverBienParId(id);
  if (!bien) {
    throw new HttpError(404, 'Bien non trouvé');
  }
  
  // Vérifier si le bien a des visites
  const aDesVisites = await bienService.bienADesVisites(id);
  if (aDesVisites) {
    throw new HttpError(409, 'Impossible de supprimer : le bien a des visites planifiées');
  }
  
  await bienService.supprimerBien(id);
  sendResponse(res, 200, 'Bien supprimé avec succès');
});

// méthode pour archiver un bien
const archiveBien = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que le bien existe
  const bien = await bienService.trouverBienParId(id);
  if (!bien) {
    throw new HttpError(404, 'Bien non trouvé');
  }
  
  const bienArchive = await bienService.archiverBien(id);
  sendResponse(res, 200, 'Bien archivé avec succès', bienArchive);
});


module.exports = {
  getCatalogue,
  getBiens,
  getBienById,
  createBien,
  updateBien,
  deleteBien,
  archiveBien
};