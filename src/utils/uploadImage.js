const cloudinary = require('../config/cloudinary');
const { HttpError } = require('./httpError');

// méthode pour uploader une image sur Cloudinary
// Un Buffer est une zone mémoire temporaire qui stocke des données binaires brutes, c'est-à-dire des octets (bytes)
const uploadImage = async (buffer, fichier, dossier = 'tech221-immo/client') => {
  if (!fichier) {
    throw new HttpError(400, 'Aucun fichier fourni');
  }

  return new Promise((resolve, reject) => {
    const nodeBuffer = Buffer.isBuffer(buffer) 
      ? buffer 
      : Buffer.from(buffer);

    const stream = cloudinary.uploader.upload_stream(
      { folder: dossier, resource_type: 'image' },
      (erreur, resultat) => {
        if (erreur) return reject(new HttpError(500, "Erreur lors de l'upload de l'image"));
        resolve(resultat);
      }
    );
    stream.end(nodeBuffer);
  });
};

// méthode pour supprimer une image de Cloudinary
const supprimerImage = async (publicId) => {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Erreur lors de la suppression Cloudinary:', error);
    throw new HttpError(500, 'Erreur lors de la suppression de l\'image');
  }
};

const extrairePublicId = (imageUrl) => {
  if (!imageUrl) return null;

  try {
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');

    if (uploadIndex === -1) return null;

    const partsApresUpload = urlParts.slice(uploadIndex + 1);

    
    const premierSegment = partsApresUpload[0];
    if (/^v\d+$/.test(premierSegment)) {
      partsApresUpload.shift();
    }

    const publicIdAvecExtension = partsApresUpload.join('/');

    return publicIdAvecExtension.replace(/\.[^/.]+$/, '');

  } catch (error) {
    console.error("Erreur lors de l'extraction du publicId:", error);
    return null;
  }
};

module.exports = { uploadImage, supprimerImage, extrairePublicId };