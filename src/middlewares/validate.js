const { creerErreur } = require('../utils/httpError');


const valider = (schema, source = 'body') => {
  return (req, res, next) => {
    const donnees = req[source];
    // abortEarly permet de collecter toutes les erreurs de validation au lieu de s'arrêter à la première, et stripUnknown supprime les champs qui ne sont pas définis dans le schéma
    const { error, value } = schema.validate(donnees, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      // next permet de passer l'erreur au middleware de gestion des erreurs centralisé, en créant une erreur HTTP personnalisée avec un statut 400 et les détails des erreurs de validation
      return next(creerErreur(400, 'Données invalides', details));
    }

    req[source] = value;
    next();
  };
};

module.exports = valider;
