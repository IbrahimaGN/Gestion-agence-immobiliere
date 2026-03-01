const { creerErreur } = require('./httpError');

/**
 * Vérifie qu'une ressource existe, sinon lève une erreur 404
 */
const verifierExistence = (ressource, nom, id) => {
  if (!ressource) {
    throw creerErreur(404, `${nom} avec l'id "${id}" introuvable`);
  }
  return ressource;
};

/**
 * Vérifie l'unicité d'un champ, sinon lève une erreur 409
 */
const verifierUnicite = (existant, champ, valeur) => {
  if (existant) {
    throw creerErreur(409, `Un enregistrement avec ${champ} "${valeur}" existe déjà`);
  }
};

module.exports = { verifierExistence, verifierUnicite };
