
const clientRepo = require('../repositories/client.repo');
const agenceRepo = require('../repositories/agence.repo');
const { HttpError } = require('../utils/httpError');

async function trouverTousClients(filtres = {}) {
  return clientRepo.trouverTousClients(filtres);
}

async function trouverClientParId(id) {
  const client = await clientRepo.trouverClientParId(id);
  if (!client) {
    throw new HttpError(404, 'Client non trouvé');
  }
  return client;
}

async function trouverClientParEmail(email) {
  return clientRepo.trouverClientParEmail(email);
}

async function trouverClientParTelephone(telephone) {
  return clientRepo.trouverClientParTelephone(telephone);
}

async function creerClient(donnees) {
  const existant = await clientRepo.trouverClientParEmail(donnees.email);
  const existantTel = await clientRepo.trouverClientParTelephone(donnees.telephone);
  if (existant) {
    throw new HttpError(409, `Un client avec l'email ${donnees.email} existe déjà`);
  }
  if (existantTel) {
    throw new HttpError(409, `Un client avec le téléphone ${donnees.telephone} existe déjà`);
  }
  const agence = await agenceRepo.trouverAgenceParId(donnees.agenceId);
  if (!agence) {
    throw new HttpError(400, `L'agence avec l'ID ${donnees.agenceId} n'existe pas`);
  }
  return clientRepo.creer(donnees);
}

async function mettreAJourClient(id, donnees) {
  await trouverClientParId(id);
  if (donnees.email) {
    const existant = await clientRepo.trouverClientParEmail(donnees.email);
    if (existant && existant.id !== parseInt(id)) {
      throw new HttpError(409, `Un client avec l'email ${donnees.email} existe déjà`);
    }
  }
  if (donnees.agenceId) {
    const agence = await agenceRepo.trouverAgenceParId(donnees.agenceId);
    if (!agence) {
      throw new HttpError(400, `L'agence avec l'ID ${donnees.agenceId} n'existe pas`);
    }
  }
  return clientRepo.mettreAJour(id, donnees);
}

async function supprimerClient(id) {
  await trouverClientParId(id);
  const aDesVisites = await clientRepo.clientADesVisites(id);
  if (aDesVisites) {
    throw new HttpError(409, 'Impossible de supprimer : le client a des visites planifiées');
  }
  return clientRepo.supprimer(id);
}

async function clientADesVisites(id) {
  return clientRepo.clientADesVisites(id);
}

module.exports = {
  trouverTousClients,
  trouverClientParId,
  trouverClientParEmail,
  trouverClientParTelephone,
  creerClient,
  mettreAJourClient,
  supprimerClient,
  clientADesVisites,
};