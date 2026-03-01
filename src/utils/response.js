// utils/response.js
/**
 * Formate et envoie une réponse JSON standardisée
 * @param {Object} res - L'objet response Express
 * @param {number} statusCode - Le code HTTP
 * @param {string} message - Le message de réponse
 * @param {any} data - Les données à envoyer (optionnel)
 */
function sendResponse(res, statusCode, message, data = null) {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  sendResponse
};