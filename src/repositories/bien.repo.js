const baseRepo = require('./base.repo');
const prisma = require('../config/db');
const { convertirId } = require('../utils/id.utils');

// Créer le repository de base pour 'bien'
const bienBase = baseRepo('bien');

// méthode pour récupérer tous les biens avec des filtres optionnels
async function trouverTousBiens(filtres = {}) {
  const where = {};

  // Filtre catalogue (exclut les ARCHIVE)
  if (filtres.catalogue) {
    where.statut = { not: 'ARCHIVE' };
  }
  
  if (filtres.statut) where.statut = filtres.statut;
  if (filtres.type) where.type = filtres.type;
  
  if (filtres.agenceId) {
    where.agenceId = convertirId(filtres.agenceId, "ID de l'agence");
  }
  
  if (filtres.prixMin || filtres.prixMax) {
    where.prix = {};
    if (filtres.prixMin) where.prix.gte = parseFloat(filtres.prixMin);
    if (filtres.prixMax) where.prix.lte = parseFloat(filtres.prixMax);
  }

  return prisma.bien.findMany({
    where,
    include: {
      agence: { select: { id: true, code: true, nom: true } },
      _count: { select: { visites: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// méthode pour récupérer un bien par son ID avec les détails complets
async function trouverBienParId(id) {
  return bienBase.trouverParId(id, {
    include: {
      agence: { select: { id: true, code: true, nom: true } },
      visites: {
        include: { 
          client: { select: { id: true, prenom: true, nom: true } } 
        },
        orderBy: { dateVisite: 'desc' },
      },
      _count: { select: { visites: true } },
    },
  });
}

// méthode pour vérifier si un bien a des visites associées
async function bienADesVisites(id) {
  const bienId = convertirId(id, "ID du bien");
  
  const count = await prisma.visite.count({ 
    where: { bienId } 
  });
  
  return count > 0;
}

// méthode pour vérifier si un bien existe
async function verifierBienExiste(id) {
  const idNumber = convertirId(id, "ID du bien");
  const bien = await prisma.bien.findUnique({ 
    where: { id: idNumber },
    select: { id: true }
  });
  return !!bien;
}

// méthode pour vérifier si un bien est visitable (pas LOUE, VENDU ou ARCHIVE)
async function bienEstVisitable(id) {
  const idNumber = convertirId(id, "ID du bien");
  
  const bien = await prisma.bien.findUnique({
    where: { id: idNumber },
    select: { statut: true }
  });
  
  if (!bien) return false;
  return !['LOUE', 'VENDU', 'ARCHIVE'].includes(bien.statut);
}

// méthode pour archiver un bien (mettre à jour son statut à ARCHIVE)
async function archiverBien(id) {
  const idNumber = convertirId(id, "ID du bien");
  
  return prisma.bien.update({
    where: { id: idNumber },
    data: { statut: 'ARCHIVE' }
  });
}

// méthode pour compter le nombre de visites associées à un bien
async function compterVisitesBien(id) {
  const bienId = convertirId(id, "ID du bien");
  
  return prisma.visite.count({
    where: { bienId }
  });
}

module.exports = {
  ...bienBase,
  trouverTousBiens,
  trouverBienParId,
  bienADesVisites,
  verifierBienExiste,
  bienEstVisitable,
  archiverBien,
  compterVisitesBien
};