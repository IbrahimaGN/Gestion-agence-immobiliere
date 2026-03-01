/**
 * Enveloppe les contrôleurs async pour capturer les erreurs
 * et les transmettre au middleware d'erreur
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
