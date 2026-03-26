const cloudinary = require('../config/cloudinary');
const { HttpError } = require('./httpError');

// méthode pour uploader une image sur Cloudinary
const uploadImage = async (buffer, fichier, dossier = 'tech221-immo/biens') => {
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

// Fonction pour extraire le publicId d'une URL Cloudinary
const extrairePublicId = (imageUrl) => {
  if (!imageUrl) return null;
  
  try {
    // Exemple d'URL Cloudinary: 
    // https://res.cloudinary.com/cloud_name/image/upload/v1234567890/tech221-immo/clients/image_name.jpg
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) return null;
    
    // Prendre la partie après 'upload' (inclut le dossier et le nom du fichier)
    const publicIdWithVersion = urlParts.slice(uploadIndex + 1).join('/');
    
    // Supprimer le préfixe de version (v1234567890/) si présent
    const publicId = publicIdWithVersion.replace(/^v\d+\//, '');
    
    // Supprimer l'extension du fichier (.jpg, .png, etc.)
    return publicId.replace(/\.[^/.]+$/, '');
  } catch (error) {
    console.error('Erreur lors de l\'extraction du publicId:', error);
    return null;
  }
};

module.exports = { uploadImage, supprimerImage, extrairePublicId };