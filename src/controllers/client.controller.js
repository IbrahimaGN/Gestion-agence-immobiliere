const clientService = require('../services/client.service');
const agenceService = require('../services/agence.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { HttpError } = require('../utils/httpError');


// méthode pour récupérer tous les clients avec des filtres optionnels
const getClients = asyncHandler(async (req, res) => {
  const { agenceId, recherche } = req.query;
  
  const filtres = {};
  if (agenceId) filtres.agenceId = agenceId;
  if (recherche) filtres.recherche = recherche;
  
  const clients = await clientService.trouverTousClients(filtres);
  sendResponse(res, 200, 'Clients récupérés avec succès', clients);
});

// méthode pour récupérer un client par son ID
const getClientById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await clientService.trouverClientParId(id);
  
  if (!client) {
    throw new HttpError(404, 'Client non trouvé');
  }
  
  sendResponse(res, 200, 'Client récupéré avec succès', client);
});

// méthode pour créer un nouveau client
const createClient = asyncHandler(async (req, res) => {
  const { prenom, nom, email, telephone, agenceId } = req.body;
  
  // Vérifier si l'email existe déjà
  const emailExistant = await clientService.trouverClientParEmail(email);
  if (emailExistant) {
    throw new HttpError(409, `Un client avec l'email ${email} existe déjà`);
  }

  // Vérifier si le téléphone existe déjà
  if (telephone) {
    const telephoneExistant = await clientService.trouverClientParTelephone(telephone);
    if (telephoneExistant) {
      throw new HttpError(409, `Un client avec le téléphone ${telephone} existe déjà`);
    }
  }
  
  // Vérifier que l'agence existe
  const agence = await agenceService.trouverAgenceParId(agenceId);
  if (!agence) {
    throw new HttpError(400, `L'agence avec l'ID ${agenceId} n'existe pas`);
  }
  
  const client = await clientService.creerClient({
    prenom,
    nom,
    email,
    telephone,
    agenceId: parseInt(agenceId)
  });
  
  sendResponse(res, 201, 'Client créé avec succès', client);
});

// méthode pour mettre à jour un client existant
const updateClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prenom, nom, email, telephone, agenceId } = req.body;
  
  // Vérifier que le client existe
  const clientExist = await clientService.trouverClientParId(id);
  if (!clientExist) {
    throw new HttpError(404, 'Client non trouvé');
  }
  
  // Si l'email est modifié, vérifier son unicité
  if (email && email !== clientExist.email) {
    const emailExistant = await clientService.trouverClientParEmail(email);
    if (emailExistant) {
      throw new HttpError(409, `Un client avec l'email ${email} existe déjà`);
    }
  }
  
  // Si l'agenceId est modifié, vérifier que l'agence existe
  if (agenceId) {
    const agence = await agenceService.trouverAgenceParId(agenceId);
    if (!agence) {
      throw new HttpError(400, `L'agence avec l'ID ${agenceId} n'existe pas`);
    }
  }
  
  const client = await clientService.mettreAJourClient(id, {
    prenom,
    nom,
    email,
    telephone,
    agenceId: agenceId ? parseInt(agenceId) : undefined
  });
  
  sendResponse(res, 200, 'Client mis à jour avec succès', client);
});

// méthode pour supprimer un client
const deleteClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que le client existe
  const client = await clientService.trouverClientParId(id);
  if (!client) {
    throw new HttpError(404, 'Client non trouvé');
  }
  
  // Vérifier si le client a des visites
  const aDesVisites = await clientService.clientADesVisites(id);
  if (aDesVisites) {
    throw new HttpError(409, 'Impossible de supprimer : le client a des visites planifiées');
  }
  
  await clientService.supprimerClient(id);
  sendResponse(res, 200, 'Client supprimé avec succès');
});

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};