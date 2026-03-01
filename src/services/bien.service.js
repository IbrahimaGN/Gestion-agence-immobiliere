// services/bien.service.js
const bienRepo = require('../repositories/bien.repo');
const agenceRepo = require('../repositories/agence.repo');
const { HttpError } = require('../utils/httpError');

async function trouverTousBiens(filtres = {}) {
  return bienRepo.trouverTousBiens(filtres);
}

async function trouverBienParId(id) {
  const bien = await bienRepo.trouverBienParId(id);
  if (!bien) {
    throw new HttpError(404, 'Bien non trouvé');
  }
  return bien;
}

async function creerBien(donnees) {
  const agence = await agenceRepo.trouverAgenceParId(donnees.agenceId);
  if (!agence) {
    throw new HttpError(400, `L'agence avec l'ID ${donnees.agenceId} n'existe pas`);
  }
  return bienRepo.creer(donnees);
}

async function mettreAJourBien(id, donnees) {
  await trouverBienParId(id);
  if (donnees.agenceId) {
    const agence = await agenceRepo.trouverAgenceParId(donnees.agenceId);
    if (!agence) {
      throw new HttpError(400, `L'agence avec l'ID ${donnees.agenceId} n'existe pas`);
    }
  }
  return bienRepo.mettreAJour(id, donnees);
}

async function supprimerBien(id) {
  await trouverBienParId(id);
  const aDesVisites = await bienRepo.bienADesVisites(id);
  if (aDesVisites) {
    throw new HttpError(409, 'Impossible de supprimer : le bien a des visites planifiées');
  }
  return bienRepo.supprimer(id);
}

async function archiverBien(id) {
  await trouverBienParId(id);
  return bienRepo.archiverBien(id);
}

async function bienADesVisites(id) {
  return bienRepo.bienADesVisites(id);
}

async function bienEstVisitable(id) {
  return bienRepo.bienEstVisitable(id);
}

async function cataloguePublic(filtres = {}) {
  return bienRepo.trouverTousBiens({ ...filtres, catalogue: true });
}

module.exports = {
  trouverTousBiens,
  trouverBienParId,
  creerBien,
  mettreAJourBien,
  supprimerBien,
  archiverBien,
  bienADesVisites,
  bienEstVisitable,
  cataloguePublic,
};