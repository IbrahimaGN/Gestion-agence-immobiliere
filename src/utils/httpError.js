class HttpError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'HttpError';
  }
}

const creerErreur = (statusCode, message, details = null) => {
  return new HttpError(statusCode, message, details);
};

module.exports = { HttpError, creerErreur };
