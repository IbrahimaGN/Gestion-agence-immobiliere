const Joi = require('joi');

const schemaCreerClient = Joi.object({
  prenom: Joi.string().min(2).max(50).required().messages({
    'any.required': 'Le prénom est obligatoire',
    'string.empty': 'Le prénom ne peut pas être vide',
  }),
  nom: Joi.string().min(2).max(50).required().messages({
    'any.required': 'Le nom est obligatoire',
    'string.empty': 'Le nom ne peut pas être vide',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'L\'email doit être valide',
    'any.required': 'L\'email est obligatoire',
  }),
 telephone: Joi.string()
    .regex(
      /^\+221(77|78|76)[0-9]{7}$/,
      'Le téléphone doit commencer par +221 suivi de 77, 78 ou 76 et contenir 9 chiffres après +221'
    ),
  agenceId: Joi.number().integer().required().messages({
    'any.required': 'L\'identifiant de l\'agence est obligatoire',
    'number.base': 'L\'identifiant de l\'agence doit être un nombre',
    'number.integer': 'L\'identifiant de l\'agence doit être un nombre entier',
  }),
  imageUrl: Joi.string().uri().optional().messages({
    'string.uri': 'L\'URL de l\'image doit être valide',
    'string.size': 'la taille de l\'image doit être inférieure à 2 Mo',
    'string.format': 'L\'URL de l\'image doit être au format valide(jpeg, png)',
  }),

});

const schemaMettreAJourClient = Joi.object({
  prenom: Joi.string().min(2).max(50),
  nom: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  telephone: Joi.string().pattern(/^(\+?[0-9]{7,15})$/),
  agenceId: Joi.number().integer().messages({
    'number.base': 'L\'identifiant de l\'agence doit être un nombre',
    'number.integer': 'L\'identifiant de l\'agence doit être un nombre entier',
  }),
  imageUrl: Joi.string().uri().optional().messages({
    'string.uri': 'L\'URL de l\'image doit être valide',
    'string.size': 'la taille de l\'image doit être inférieure à 2 Mo',
    'string.format': 'L\'URL de l\'image doit être au format valide(jpeg, png)',
  }),
}).min(1);

module.exports = { schemaCreerClient, schemaMettreAJourClient };