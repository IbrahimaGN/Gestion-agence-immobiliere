const baseRepo = require('./base.repo');
const prisma = require('../config/db');
const { convertirId } = require('../utils/id.utils');

// Créer le repository de base pour 'client'
const clientBase = baseRepo('client');

// méthode pour récupérer tous les clients avec des filtres optionnels
async function trouverTousClients(filtres = {}) {
  const where = {};
  
  if (filtres.agenceId) {
    where.agenceId = convertirId(filtres.agenceId, "ID de l'agence");
  }
  
  if (filtres.recherche) {
    where.OR = [
      { nom: { contains: filtres.recherche, mode: 'insensitive' } },
      { prenom: { contains: filtres.recherche, mode: 'insensitive' } },
      { email: { contains: filtres.recherche, mode: 'insensitive' } },
    ];
  }
  
  return prisma.client.findMany({
    where,
    include: {
      agence: { select: { id: true, code: true, nom: true } },
      _count: { select: { visites: true } }
    },
    orderBy: { nom: 'asc' }
  });
}

// méthode pour récupérer un client par son ID avec les détails complets
async function trouverClientParId(id) {
  return clientBase.trouverParId(id, {
    include: {
      agence: { select: { id: true, code: true, nom: true } },
      visites: {
        include: { 
          bien: { select: { id: true, titre: true, adresse: true } } 
        },
        orderBy: { dateVisite: 'desc' }
      }
    }
  });
}

// méthode pour récupérer un client par son email
async function trouverClientParEmail(email) {
  return prisma.client.findUnique({ 
    where: { email } 
  });
}

async function trouverClientParTelephone(telephone) {
  return prisma.client.findUnique({ where: { telephone } });
}

// méthode pour vérifier si un client a des visites associées
async function clientADesVisites(id) {
  const clientId = convertirId(id, "ID du client");
  
  const count = await prisma.visite.count({ 
    where: { clientId } 
  });
  
  return count > 0;
}

// méthode pour compter le nombre de visites associées à un client
async function compterVisitesClient(id) {
  const clientId = convertirId(id, "ID du client");
  
  return prisma.visite.count({
    where: { clientId }
  });
}

// méthode pour vérifier si un client existe
async function verifierClientExiste(id) {
  const idNumber = convertirId(id, "ID du client");
  const client = await prisma.client.findUnique({ 
    where: { id: idNumber },
    select: { id: true }
  });
  return !!client;
}

module.exports = {
  ...clientBase,
  trouverTousClients,
  trouverClientParId,
  trouverClientParEmail,
  trouverClientParTelephone,
  clientADesVisites,
  compterVisitesClient,
  verifierClientExiste
};