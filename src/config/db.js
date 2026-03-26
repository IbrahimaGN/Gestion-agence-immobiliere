const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  //permet de loger les requettes sql dans la console en mode development
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

module.exports = prisma;
