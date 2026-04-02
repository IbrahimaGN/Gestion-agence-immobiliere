const authService = require('../services/authService');

// Inscription d'un nouvel utilisateur
const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Connexion utilisateur
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};