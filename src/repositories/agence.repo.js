const baseRepo = require('./base.repo');
const prisma = require('../config/db');
const { convertirId } = require('../utils/id.utils');

// Créer le repository de base pour 'agence'
const agenceBase = baseRepo('agence');

//méthode pour récupérer toutes les agences avec le nombre de clients et biens associés
async function trouverToutesAgences() {
  return prisma.agence.findMany({
    orderBy: { nom: 'asc' },
    include: {
      _count: { select: { clients: true, biens: true } },
    },
  });
}

// méthode pour récupérer une agence par son ID avec les clients et biens associés
async function trouverAgenceParId(id) {
  return agenceBase.trouverParId(id, {
    include: {
      clients: {
        select: { id: true, prenom: true, nom: true, email: true }
      },
      biens: {
        select: { id: true, titre: true, statut: true, prix: true }
      },
      _count: {
        select: { clients: true, biens: true }
      }
    }
  });
}

// méthode pour récupérer une agence par son code
async function trouverAgenceParCode(code) {
  return prisma.agence.findUnique({ 
    where: { code } 
  });
}

// méthode pour vérifier si une agence a des relations (clients ou biens)
async function agenceADesRelations(id) {
  const agenceId = convertirId(id, "ID de l'agence");
  
  const [clients, biens] = await Promise.all([
    prisma.client.count({ where: { agenceId } }),
    prisma.bien.count({ where: { agenceId } })
  ]);
  
  return { 
    aDesRelations: clients > 0 || biens > 0, 
    clients, 
    biens 
  };
}

// méthode pour compter le nombre de clients et biens associés à une agence
async function compterClientsEtBiens(id) {
  const agenceId = convertirId(id, "ID de l'agence");
  
  const [clients, biens] = await Promise.all([
    prisma.client.count({ where: { agenceId } }),
    prisma.bien.count({ where: { agenceId } })
  ]);
  
  return { clients, biens };
}


module.exports = {
  ...agenceBase,
  trouverToutesAgences,
  trouverAgenceParId,
  trouverAgenceParCode,
  agenceADesRelations,
  compterClientsEtBiens
};