
const multer = require('multer');
const HttpError = require('../utils/httpError');

// Stockage en mémoire (buffer) → envoyé ensuite à Cloudinary
const stockage = multer.memoryStorage();

// Filtre : accepter uniquement les images
const filtrerFichier = (req, fichier, cb) => {
  const typesAcceptes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (typesAcceptes.includes(fichier.mimetype)) {
    cb(null, true);
  } else {
    cb(HttpError.badRequest('Format de fichier non supporté. Utilisez : JPEG, PNG ou WebP'), false);
  }
};

// Configuration Multer
const upload = multer({
  storage: stockage,
  fileFilter: filtrerFichier,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mo maximum
  },
});

// Middlewares préconfigurés
const uploadUneFoto = upload.single('image');
const uploadPlusieursPhotos = upload.array('images', 5); // Max 5 images

module.exports = { uploadUneFoto, uploadPlusieursPhotos };
