
const express = require('express');
const agenceRoutes = require('./src/routes/agence.routes');
const clientRoutes = require('./src/routes/client.routes');
const bienRoutes = require('./src/routes/bien.routes');
const visiteRoutes = require('./src/routes/visite.routes');
const notFound = require('./src/middlewares/notFound');
const errorHandler = require('./src/middlewares/errorHandler'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/agences', agenceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/biens', bienRoutes);
app.use('/api/visites', visiteRoutes);

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});