# TECH 221 - API Gestion Immobilière

API REST complète pour la gestion des agences, clients, biens immobiliers et visites.

## Stack technique
- **Runtime** : Node.js + Express.js
- **Base de données** : PostgreSQL via Prisma ORM
- **Validation** : Joi
- **Documentation** : Swagger UI

## Architecture du projet

```
tech221-immo/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma       ← Modèles BDD
│   └── seed.js             ← Données initiales
├── src/
│   ├── app.js              ← Configuration Express
│   ├── server.js           ← Point d'entrée
│   ├── config/
│   │   ├── db.js           ← Client Prisma
│   │   └── env.js          ← Variables d'environnement
│   ├── controllers/        ← Gestion des requêtes HTTP
│   │   ├── agence.controller.js
│   │   ├── client.controller.js
│   │   ├── bien.controller.js
│   │   └── visite.controller.js
│   ├── middlewares/
│   │   ├── errorHandler.js ← Gestion centralisée des erreurs
│   │   ├── notFound.js     ← Route 404
│   │   └── validate.js     ← Middleware de validation Joi
│   ├── repositories/       ← Accès BDD (couche données)
│   │   ├── base.repo.js    ← CRUD générique
│   │   ├── agence.repo.js
│   │   ├── client.repo.js
│   │   ├── bien.repo.js
│   │   └── visite.repo.js
│   ├── routes/             ← Définition des routes
│   │   ├── agence.routes.js
│   │   ├── client.routes.js
│   │   ├── bien.routes.js
│   │   └── visite.routes.js
│   ├── services/           ← Logique métier
│   │   ├── agence.service.js
│   │   ├── client.service.js
│   │   ├── bien.service.js
│   │   └── visite.service.js
│   ├── utils/
│   │   ├── asyncHandler.js     ← Capture erreurs async
│   │   ├── crud.controller.js  ← Contrôleur CRUD générique
│   │   ├── httpError.js        ← Erreurs HTTP personnalisées
│   │   ├── response.js         ← Format de réponse uniforme
│   │   └── service.helpers.js  ← Helpers métier
│   └── validation/         ← Schémas Joi
│       ├── agence.schema.js
│       ├── client.schema.js
│       ├── bien.schema.js
│       └── visite.schema.js
├── swagger.json            ← Documentation OpenAPI
├── .env
└── package.json
```

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement

cp .env.example .env
# Modifier DATABASE_URL avec vos identifiants PostgreSQL

# 3. Générer le client Prisma
npm run db:generate

# 4. Exécuter les migrations
npm run db:migrate

# 5. Optionnel : insérer des données de test
npm run db:seed

# 6. Démarrer le serveur
npm run dev
```

## Endpoints principaux

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/agences | Lister les agences |
| POST | /api/agences | Créer une agence |
| PUT | /api/agences/:id | Modifier une agence |
| DELETE | /api/agences/:id | Supprimer une agence |
| GET | /api/clients | Lister les clients |
| POST | /api/clients | Créer un client |
| GET | /api/biens/catalogue | Catalogue public (sans ARCHIVE) |
| GET | /api/biens | Tous les biens (admin) |
| POST | /api/biens | Enregistrer un bien |
| PATCH | /api/biens/:id/archiver | Archiver un bien |
| GET | /api/visites | Lister les visites |
| POST | /api/visites | Planifier une visite |
| PATCH | /api/visites/:id/statut | Changer statut visite |

## Règles métier importantes

- **Agence** : code unique au format `XXX-00` (ex: DKR-01)
- **Client** : email unique, agenceId obligatoire et existant
- **Bien** : ne peut être créé sans agence valide, prix >= 0
- **Visite** : impossible si bien est LOUE/VENDU/ARCHIVE, date obligatoirement dans le futur, pas de doublon (clientId + bienId + date)
- **Suppression** : interdite si relations existent (utiliser l'archivage)

## Documentation
Swagger disponible sur : http://localhost:3000/api-docs
