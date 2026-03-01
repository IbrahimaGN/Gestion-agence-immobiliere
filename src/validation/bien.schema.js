const Joi = require('joi');

const TYPES_BIEN = ['MAISON', 'APPARTEMENT', 'STUDIO', 'TERRAIN', 'VILLA', 'BUREAU', 'COMMERCE'];
const STATUTS_BIEN = ['DISPONIBLE', 'RESERVE', 'LOUE', 'VENDU', 'ARCHIVE'];

const schemaCreerBien = Joi.object({
  titre: Joi.string().min(3).max(200).required().messages({
    'any.required': 'Le titre est obligatoire',
    'string.empty': 'Le titre ne peut pas être vide',
  }),
  type: Joi.string().valid(...TYPES_BIEN).required().messages({
    'any.only': `Le type doit être l'un de : ${TYPES_BIEN.join(', ')}`,
    'any.required': 'Le type est obligatoire',
  }),
  adresse: Joi.string().min(5).max(255).required().messages({
    'any.required': 'L\'adresse est obligatoire',
    'string.empty': 'L\'adresse ne peut pas être vide',
  }),
  prix: Joi.number().min(0).required().messages({
    'number.min': 'Le prix doit être supérieur ou égal à 0',
    'any.required': 'Le prix est obligatoire',
  }),
  statut: Joi.string().valid(...STATUTS_BIEN).default('DISPONIBLE'),
  agenceId: Joi.number().integer().required().messages({  // CORRECTION : number().integer() au lieu de integer()
    'any.required': 'L\'identifiant de l\'agence est obligatoire',
    'number.base': 'L\'identifiant de l\'agence doit être un nombre',
    'number.integer': 'L\'identifiant de l\'agence doit être un nombre entier',
  }),
});

const schemaMettreAJourBien = Joi.object({
  titre: Joi.string().min(3).max(200),
  type: Joi.string().valid(...TYPES_BIEN),
  adresse: Joi.string().min(5).max(255),
  prix: Joi.number().min(0),
  statut: Joi.string().valid(...STATUTS_BIEN),
  agenceId: Joi.number().integer(),  // CORRECTION : number().integer() au lieu de integer()
}).min(1);

module.exports = { schemaCreerBien, schemaMettreAJourBien };