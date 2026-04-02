const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');

class AuthService {
  async register(userData) {
    const { email, password, prenom, nom, telephone, image, role } = userData;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const user = await prisma.utilisateur.create({
      data: {
        email,
        password: hashedPassword,
        prenom,
        nom,
        telephone,
        image,
        role: role || 'CLIENT'
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        role: true,
        telephone: true,
        image: true
      }
    });
    
    return user;
  }
  
  async login(email, password) {
    // Trouver l'utilisateur
    const user = await prisma.utilisateur.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Générer le token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
    
    return { token, user: {
      id: user.id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      role: user.role
    }};
  }
}

module.exports = new AuthService();