/**
 * Convertit un ID en nombre
 * @param {any} id - L'ID à convertir
 * @param {string} nom - Nom du champ pour le message d'erreur
 * @returns {number} L'ID converti
 * @throws {Error} Si l'ID n'est pas valide
 */
function convertirId(id, nom = 'ID') {
  if (id === undefined || id === null) {
    throw new Error(`Le ${nom} est requis`);
  }
  
  if (typeof id === 'number') return id;
  
  const idNumber = parseInt(id);
  if (isNaN(idNumber)) {
    throw new Error(`Le ${nom} doit être un nombre valide (reçu: ${id})`);
  }
  
  return idNumber;
}

/**
 * Traite récursivement tous les IDs dans un objet where
 * @param {Object} where - Les conditions where
 * @returns {Object} Les conditions avec IDs convertis
 */
function traiterIdsWhere(where) {
  if (!where || typeof where !== 'object') return where;
  
  const result = {};
  for (const [key, value] of Object.entries(where)) {
    // Si la clé contient 'Id' (insensible à la casse)
    if (key.toLowerCase().includes('id') && value !== undefined) {
      result[key] = convertirId(value, key);
    }
    // Si c'est un tableau (AND, OR, NOT)
    else if (Array.isArray(value)) {
      result[key] = value.map(item => traiterIdsWhere(item));
    }
    // Si c'est un objet imbriqué
    else if (value && typeof value === 'object') {
      result[key] = traiterIdsWhere(value);
    }
    else {
      result[key] = value;
    }
  }
  return result;
}

module.exports = {
  convertirId,
  traiterIdsWhere
};