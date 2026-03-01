// methode pour envoyer une réponse JSON standardisée
function sendResponse(res, statusCode, message, data = null) {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    //toISOString() permet de formater la date au format ISO 8601, qui est un format de date standard largement utilisé pour les API
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