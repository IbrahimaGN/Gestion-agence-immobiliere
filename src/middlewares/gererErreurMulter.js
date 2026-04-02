
const multer = require('multer');
const { HttpError } = require('../utils/httpError');

const gererErreurMulter = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new HttpError(400, 'La taille de l\'image doit être inférieure à 2 Mo'));
    }
    return next(new HttpError(400, `Erreur upload : ${err.message}`));
  }
  next(err);
};

module.exports = gererErreurMulter;