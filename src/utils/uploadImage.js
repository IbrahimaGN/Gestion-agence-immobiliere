// utils/uploadImage.js
const cloudinary = require('../config/cloudinary');
const { HttpError } = require('./httpError');

/**
 * Téléverse un fichier image vers Cloudinary
 * @param {Object} fichier - Fichier multer (req.file)
 * @param {string} dossier - Dossier Cloudinary de destination
 * @returns {Object} Résultat Cloudinary (url, public_id, etc.)
 */
const uploadImage = async (fichier, dossier = 'tech221-immo/biens') => {
  if (!fichier) {
    throw new HttpError(400, 'Aucun fichier fourni');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: dossier, resource_type: 'image' },
      (erreur, resultat) => {
        if (erreur) return reject(new HttpError(500, "Erreur lors de l'upload de l'image"));
        resolve(resultat);
      }
    );
    stream.end(fichier.buffer);
  });
};

/**
 * Supprime une image de Cloudinary
 * @param {string} publicId - Identifiant public Cloudinary
 */
const supprimerImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, supprimerImage };