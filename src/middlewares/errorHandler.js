//permet de gérer les erreurs de manière centralisée dans l'application Express
const { HttpError } = require('../utils/httpError');

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  console.error(`[ERREUR] ${err.name}: ${err.message}`);

  // Erreur Prisma - violation de contrainte unique
  // .meta? permet d'accéder à des informations supplémentaires sur l'erreur, comme les champs concernés
  // .target? contient les champs qui ont causé la violation de contrainte unique, et .join(', ') les formate en une chaîne lisible
  if (err.code === 'P2002') {
    const champ = err.meta?.target?.join(', ') || 'champ';
    return res.status(409).json({
      succes: false,
      message: `Violation de contrainte unique sur : ${champ}`,
    });
  }

  // Erreur Prisma - enregistrement introuvable
  if (err.code === 'P2025') {
    return res.status(404).json({
      succes: false,
      message: err.meta?.cause || 'Enregistrement introuvable',
    });
  }

  // Erreur Prisma - clé étrangère invalide
  if (err.code === 'P2003') {
    return res.status(400).json({
      succes: false,
      message: "Référence invalide : la ressource liée n'existe pas",
    });
  }

  // Erreur HTTP personnalisée
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      succes: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Erreur de validation (ID invalide)
  if (err.message && err.message.includes('doit être un nombre')) {
    return res.status(400).json({
      succes: false,
      message: err.message,
    });
  }

  // Erreur générique
  return res.status(500).json({
    succes: false,
    message:
      process.env.NODE_ENV === 'production' ? 'Erreur interne du serveur' : err.message,
  });
};

module.exports = errorHandler;