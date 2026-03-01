const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log(' Démarrage...');

  // Créer les agences
  const agenceDakar = await prisma.agence.upsert({
    where: { code: 'DKR-01' },
    update: {},
    create: {
      code: 'DKR-01',
      nom: 'Agence Dakar Plateau',
      adresse: 'Avenue Léopold Sédar Senghor, Dakar',
    },
  });

  const agenceThies = await prisma.agence.upsert({
    where: { code: 'THS-01' },
    update: {},
    create: {
      code: 'THS-01',
      nom: 'Agence Thiès Centre',
      adresse: 'Boulevard de la République, Thiès',
    },
  });

  const agenceSaintLouis = await prisma.agence.upsert({
    where: { code: 'SLO-01' },
    update: {},
    create: {
      code: 'SLO-01',
      nom: 'Agence Saint-Louis',
      adresse: 'Rue de la Mauritanie, Saint-Louis',
    },
  });

  console.log(' Agences créées');

  // Créer des clients
  const client1 = await prisma.client.upsert({
    where: { email: 'moussa.diallo@email.com' },
    update: {},
    create: {
      prenom: 'Moussa',
      nom: 'Diallo',
      email: 'moussa.diallo@email.com',
      telephone: '+221771234567',
      agenceId: agenceDakar.id,
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: 'fatou.sow@email.com' },
    update: {},
    create: {
      prenom: 'Fatou',
      nom: 'Sow',
      email: 'fatou.sow@email.com',
      telephone: '+221769876543',
      agenceId: agenceThies.id,
    },
  });

  console.log(' Clients créés');

  // Créer des biens
  const bien1 = await prisma.bien.create({
    data: {
      titre: 'Appartement F3 aux Almadies',
      type: 'APPARTEMENT',
      adresse: 'Rue 10, Almadies, Dakar',
      prix: 250000,
      statut: 'DISPONIBLE',
      agenceId: agenceDakar.id,
    },
  });

  const bien2 = await prisma.bien.create({
    data: {
      titre: 'Villa 4 chambres à Fann',
      type: 'VILLA',
      adresse: 'Avenue Cheikh Anta Diop, Fann, Dakar',
      prix: 1500000,
      statut: 'DISPONIBLE',
      agenceId: agenceDakar.id,
    },
  });

  await prisma.bien.create({
    data: {
      titre: 'Studio meublé à Thiès',
      type: 'STUDIO',
      adresse: 'Cité Lamy, Thiès',
      prix: 80000,
      statut: 'RESERVE',
      agenceId: agenceThies.id,
    },
  });

  console.log(' Biens créés');

  // Créer une visite
  const demain = new Date();
  demain.setDate(demain.getDate() + 7);

  await prisma.visite.create({
    data: {
      clientId: client1.id,
      bienId: bien1.id,
      dateVisite: demain,
      statut: 'DEMANDEE',
      commentaire: 'Intéressé par un bail de 2 ans',
    },
  });

  console.log(' Visite créée');
  console.log(' Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(' Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
