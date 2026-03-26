
const agenceRepo = require('../repositories/agence.repo');
const { HttpError } = require('../utils/httpError');

async function trouverToutesAgences() {
  return agenceRepo.trouverToutesAgences();
}

async function trouverAgenceParId(id) {
  const agence = await agenceRepo.trouverAgenceParId(id);
  if (!agence) {
    throw new HttpError(404, 'Agence non trouvée');
  }
  return agence;
}

async function trouverAgenceParCode(code) {
  return agenceRepo.trouverAgenceParCodeEtSousAgence(code, null);
}

async function creerAgence(donnees) {
  const { code, sousAgence = null } = donnees;
  
  // Vérifier l'unicité du couple (code, sousAgence)
  const existant = await agenceRepo.trouverAgenceParCodeEtSousAgence(code, sousAgence);
  if (existant) {
    if (sousAgence) {
      throw new HttpError(409, `Une agence avec le code ${code} et la sous-agence ${sousAgence} existe déjà`);
    } else {
      throw new HttpError(409, `Une agence avec le code ${code} existe déjà`);
    }
  }
  
  return agenceRepo.creer(donnees);
}

async function mettreAJourAgence(id, donnees) {
  const agenceExistante = await trouverAgenceParId(id);
  
  if (donnees.code || donnees.sousAgence !== undefined) {
    const nouveauCode = donnees.code || agenceExistante.code;
    const nouvelleSousAgence = donnees.sousAgence !== undefined ? donnees.sousAgence : agenceExistante.sousAgence;
    
    // Vérifier l'unicité du nouveau couple (code, sousAgence)
    const existant = await agenceRepo.trouverAgenceParCodeEtSousAgence(nouveauCode, nouvelleSousAgence);
    if (existant && existant.id !== parseInt(id)) {
      if (nouvelleSousAgence) {
        throw new HttpError(409, `Une agence avec le code ${nouveauCode} et la sous-agence ${nouvelleSousAgence} existe déjà`);
      } else {
        throw new HttpError(409, `Une agence avec le code ${nouveauCode} existe déjà`);
      }
    }
  }
  
  return agenceRepo.mettreAJour(id, donnees);
}

async function supprimerAgence(id) {
  await trouverAgenceParId(id);
  const { aDesRelations, clients, biens } = await agenceRepo.agenceADesRelations(id);
  if (aDesRelations) {
    throw new HttpError(
      409,
      `Impossible de supprimer : l'agence a ${clients} client(s) et ${biens} bien(s) liés`
    );
  }
  return agenceRepo.supprimer(id);
}

async function agenceADesRelations(id) {
  return agenceRepo.agenceADesRelations(id);
}

module.exports = {
  trouverToutesAgences,
  trouverAgenceParId,
  trouverAgenceParCode,
  creerAgence,
  mettreAJourAgence,
  supprimerAgence,
  agenceADesRelations,
};