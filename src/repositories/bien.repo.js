const baseRepo = require('./base.repo');
const prisma = require('../config/db');
const { convertirId } = require('../utils/id.utils');

// Créer le repository de base pour 'bien'
const bienBase = baseRepo('bien');

/**
 * Récupère tous les biens avec filtres optionnels
 */
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

/**
 * Récupère un bien par son ID avec ses visites
 */
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

/**
 * Vérifie si un bien a des visites
 */
async function bienADesVisites(id) {
  const bienId = convertirId(id, "ID du bien");
  
  const count = await prisma.visite.count({ 
    where: { bienId } 
  });
  
  return count > 0;
}

/**
 * Vérifie si un bien existe
 */
async function verifierBienExiste(id) {
  const idNumber = convertirId(id, "ID du bien");
  const bien = await prisma.bien.findUnique({ 
    where: { id: idNumber },
    select: { id: true }
  });
  return !!bien;
}

/**
 * Vérifie si un bien est visitable (pas LOUE, VENDU ou ARCHIVE)
 */
async function bienEstVisitable(id) {
  const idNumber = convertirId(id, "ID du bien");
  
  const bien = await prisma.bien.findUnique({
    where: { id: idNumber },
    select: { statut: true }
  });
  
  if (!bien) return false;
  return !['LOUE', 'VENDU', 'ARCHIVE'].includes(bien.statut);
}

/**
 * Archive un bien (change son statut)
 */
async function archiverBien(id) {
  const idNumber = convertirId(id, "ID du bien");
  
  return prisma.bien.update({
    where: { id: idNumber },
    data: { statut: 'ARCHIVE' }
  });
}

/**
 * Compte le nombre de visites d'un bien
 */
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