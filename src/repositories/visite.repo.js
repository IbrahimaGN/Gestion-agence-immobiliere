const baseRepo = require('./base.repo');
const prisma = require('../config/db');
const { convertirId } = require('../utils/id.utils');

// Créer le repository de base pour 'visite'
const visiteBase = baseRepo('visite');

/**
 * Récupère toutes les visites avec filtres optionnels
 */
async function trouverToutesVisites(filtres = {}) {
  const where = {};
  
  if (filtres.clientId) {
    where.clientId = convertirId(filtres.clientId, "ID du client");
  }
  
  if (filtres.bienId) {
    where.bienId = convertirId(filtres.bienId, "ID du bien");
  }
  
  if (filtres.statut) where.statut = filtres.statut;

  return prisma.visite.findMany({
    where,
    include: {
      client: { select: { id: true, prenom: true, nom: true, email: true } },
      bien: { select: { id: true, titre: true, adresse: true, type: true } },
    },
    orderBy: { dateVisite: 'asc' },
  });
}

/**
 * Récupère une visite par son ID avec toutes ses relations
 */
async function trouverVisiteParId(id) {
  return visiteBase.trouverParId(id, {
    include: {
      client: true,
      bien: { 
        include: { 
          agence: { select: { code: true, nom: true } } 
        } 
      },
    },
  });
}

/**
 * Vérifie s'il existe un doublon de visite
 */
async function verifierDoublonVisite(clientId, bienId, dateVisite) {
  const clientIdNum = convertirId(clientId, "ID du client");
  const bienIdNum = convertirId(bienId, "ID du bien");
  
  return prisma.visite.findUnique({
    where: {
      clientId_bienId_dateVisite: {
        clientId: clientIdNum,
        bienId: bienIdNum,
        dateVisite: new Date(dateVisite)
      }
    }
  });
}

/**
 * Compte les visites d'un client
 */
async function compterVisitesParClient(clientId) {
  const id = convertirId(clientId, "ID du client");
  
  return prisma.visite.count({
    where: { clientId: id }
  });
}

/**
 * Compte les visites d'un bien
 */
async function compterVisitesParBien(bienId) {
  const id = convertirId(bienId, "ID du bien");
  
  return prisma.visite.count({
    where: { bienId: id }
  });
}

/**
 * Récupère les visites à venir
 */
async function trouverVisitesAVenir() {
  const maintenant = new Date();
  
  return prisma.visite.findMany({
    where: {
      dateVisite: { gte: maintenant },
      statut: { in: ['DEMANDEE', 'CONFIRMEE'] }
    },
    include: {
      client: { select: { prenom: true, nom: true, email: true } },
      bien: { select: { titre: true, adresse: true } }
    },
    orderBy: { dateVisite: 'asc' }
  });
}

/**
 * Met à jour le statut d'une visite
 */
async function mettreAJourStatut(id, statut) {
  const idNumber = convertirId(id, "ID de la visite");
  
  return prisma.visite.update({
    where: { id: idNumber },
    data: { statut }
  });
}

module.exports = {
  ...visiteBase,
  trouverToutesVisites,
  trouverVisiteParId,
  verifierDoublonVisite,
  compterVisitesParClient,
  compterVisitesParBien,
  trouverVisitesAVenir,
  mettreAJourStatut
};