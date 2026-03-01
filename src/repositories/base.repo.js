// repositories/base.repo.js
const prisma = require('../config/db');
const { convertirId, traiterIdsWhere } = require('../utils/id.utils');

/**
 * Fonctions génériques pour les opérations CRUD
 */
const baseRepo = (modele) => {
  const db = prisma[modele];

  return {
    /**
     * Trouver tous les enregistrements
     */
    async trouverTout(options = {}) {
      if (options.where) {
        options.where = traiterIdsWhere(options.where);
      }
      return db.findMany(options);
    },

    /**
     * Trouver par ID
     */
    async trouverParId(id, options = {}) {
      const idNumber = convertirId(id, modele);
      return db.findUnique({
        where: { id: idNumber },
        ...options
      });
    },

    /**
     * Trouver un enregistrement avec conditions
     */
    async trouverUn(where, options = {}) {
      const whereTraite = traiterIdsWhere(where);
      return db.findFirst({
        where: whereTraite,
        ...options
      });
    },

    /**
     * Créer un enregistrement
     */
    async creer(donnees) {
      return db.create({ data: donnees });
    },

    /**
     * Mettre à jour un enregistrement
     */
    async mettreAJour(id, donnees) {
      const idNumber = convertirId(id, modele);
      return db.update({
        where: { id: idNumber },
        data: donnees
      });
    },

    /**
     * Supprimer un enregistrement
     */
    async supprimer(id) {
      const idNumber = convertirId(id, modele);
      return db.delete({ where: { id: idNumber } });
    },

    /**
     * Compter les enregistrements
     */
    async compter(where = {}) {
      const whereTraite = traiterIdsWhere(where);
      return db.count({ where: whereTraite });
    }
  };
};

module.exports = baseRepo;