
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Configuration
const env = require('./config/env');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// Routes
const agenceRoutes = require('./routes/agence.routes');
const clientRoutes = require('./routes/client.routes');
const bienRoutes = require('./routes/bien.routes');
const visiteRoutes = require('./routes/visite.routes');

// Initialisation de l'application Express
const app = express();

//  Middlewares globaux 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === 'development') app.use(morgan('dev'));

//  Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'TECH 221 Immo - API',
}));

//  Route de santé
app.get('/health', (req, res) => {
  res.json({
    succes: true,
    message: ' TECH 221 Immo API — Opérationnelle',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// Routes de l'API
app.use('/api/agences', agenceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/biens',   bienRoutes);
app.use('/api/visites', visiteRoutes);

// Gestion des erreurs (DOIT être en dernier)
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
app.listen(env.PORT, () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║       🏠 TECH 221 — API Immobilière v1.0.0       ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  ✅ Serveur démarré sur le port : ${env.PORT}            ║`);
  console.log(`║  🌐 URL    : http://localhost:${env.PORT}                ║`);
  console.log(`║  📚 Docs   : http://localhost:${env.PORT}/api-docs       ║`);
  console.log('╚══════════════════════════════════════════════════╝\n');
});

module.exports = app;