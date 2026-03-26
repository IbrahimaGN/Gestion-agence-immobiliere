
const Joi = require('joi');

const schemaCreerAgence = Joi.object({
  code: Joi.string()
    .pattern(/^[A-Z]{2,3}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Le code doit suivre le format : ex. DKR-01',
      'any.required': 'Le code est obligatoire',
      'string.empty': 'Le code ne peut pas être vide',
    }),
  nom: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Le nom est obligatoire',
    'string.empty': 'Le nom ne peut pas être vide',
    'string.min': 'Le nom doit contenir au moins 2 caractères',
  }),
  adresse: Joi.string().min(5).max(255).required().messages({
    'any.required': 'L\'adresse est obligatoire',
    'string.empty': 'L\'adresse ne peut pas être vide',
  }),
});

const schemaMettreAJourAgence = Joi.object({
  nom: Joi.string().min(2).max(100),
  adresse: Joi.string().min(5).max(255),
}).min(1).messages({
  'object.min': 'Au moins un champ est requis pour la mise à jour',
});

module.exports = { schemaCreerAgence, schemaMettreAJourAgence };
