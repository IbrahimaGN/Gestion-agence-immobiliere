//methode pour convertir un ID en nombre entier et vérifier sa validité
function convertirId(id, nom = 'ID') {
  if (id === undefined || id === null) {
    throw new Error(`Le ${nom} est requis`);
  }
  // typeof permet de vérifier si l'ID est déjà un nombre, auquel cas on le retourne tel quel
  if (typeof id === 'number') return id;
  
  const idNumber = parseInt(id);
  if (isNaN(idNumber)) {
    throw new Error(`Le ${nom} doit être un nombre valide (reçu: ${id})`);
  }
  
  return idNumber;
}

// méthode pour traiter les objets "where" et convertir tous les champs d'ID en nombres entiers
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