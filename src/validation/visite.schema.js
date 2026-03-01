const Joi = require('joi');

const STATUTS_VISITE = ['DEMANDEE', 'CONFIRMEE', 'ANNULEE', 'EFFECTUEE'];

const schemaCreerVisite = Joi.object({
  clientId: Joi.number().integer().required().messages({  // CORRECTION : number().integer() au lieu de integer()
    'any.required': 'L\'identifiant du client est obligatoire',
    'number.base': 'L\'identifiant du client doit être un nombre',
    'number.integer': 'L\'identifiant du client doit être un nombre entier',
  }),
  bienId: Joi.number().integer().required().messages({  // CORRECTION : number().integer() au lieu de integer()
    'any.required': 'L\'identifiant du bien est obligatoire',
    'number.base': 'L\'identifiant du bien doit être un nombre',
    'number.integer': 'L\'identifiant du bien doit être un nombre entier',
  }),
  dateVisite: Joi.date().iso().greater('now').required().messages({
    'date.greater': 'La date de visite doit être dans le futur',
    'any.required': 'La date de visite est obligatoire',
    'date.format': 'La date doit être au format ISO (ex: 2024-12-25T10:00:00Z)',
  }),
  commentaire: Joi.string().max(500).optional().allow(''),
});

const schemaMettreAJourVisite = Joi.object({
  statut: Joi.string().valid(...STATUTS_VISITE).required().messages({
    'any.only': `Le statut doit être l'un de : ${STATUTS_VISITE.join(', ')}`,
    'any.required': 'Le statut est obligatoire pour la mise à jour',
  }),
  commentaire: Joi.string().max(500).optional().allow(''),
});

module.exports = { schemaCreerVisite, schemaMettreAJourVisite };