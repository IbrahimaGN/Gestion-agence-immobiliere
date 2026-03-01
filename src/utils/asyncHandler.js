// permet de gérer les erreurs dans les fonctions asynchrones des routes sans avoir à utiliser try/catch dans chaque fonction
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
