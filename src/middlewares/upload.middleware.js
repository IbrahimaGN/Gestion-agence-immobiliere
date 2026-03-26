
const multer = require('multer');
const HttpError = require('../utils/httpError');

// Stockage en mémoire (buffer) → envoyé ensuite à Cloudinary
const stockage = multer.memoryStorage();

// Filtre : accepter uniquement les images
const filtrerFichier = (req, fichier, cb) => {
  const typesAcceptes = ['image/jpeg', 'image/png'];
  if (typesAcceptes.includes(fichier.mimetype)) {
    cb(null, true);
  } else {
    cb(HttpError.badRequest('Format de fichier non supporté. Utilisez : JPEG ou PNG'), false);
  }
};

// Configuration Multer
const upload = multer({
  storage: stockage,
  fileFilter: filtrerFichier,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 Mo maximum
  },
});

// Middlewares préconfigurés
const uploadImage = upload.single('imageUrl');
const uploadPlusieursPhotos = upload.array('images', 5); // Max 5 images


module.exports = { uploadImage, uploadPlusieursPhotos };
