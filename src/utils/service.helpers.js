//helpers contient des fonctions utilitaires pour les services, comme la vérification d'existence ou d'unicité d'une ressource, qui peuvent être utilisées dans plusieurs services pour éviter la duplication de code
const { creerErreur } = require('./httpError');

// methode pour vérifier l'existence d'une ressource, sinon lève une erreur 404
const verifierExistence = (ressource, nom, id) => {
  if (!ressource) {
    throw creerErreur(404, `${nom} avec l'id "${id}" introuvable`);
  }
  return ressource;
};

// methode pour vérifier l'unicité d'une ressource, sinon lève une erreur 409
const verifierUnicite = (existant, champ, valeur) => {
  if (existant) {
    throw creerErreur(409, `Un enregistrement avec ${champ} "${valeur}" existe déjà`);
  }
};

module.exports = { verifierExistence, verifierUnicite };
