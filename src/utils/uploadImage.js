
const cloudinary = require('../config/cloudinary');
const { HttpError } = require('./httpError');

// méthode pour uploader une image sur Cloudinary
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

// méthode pour supprimer une image de Cloudinary
const supprimerImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, supprimerImage };