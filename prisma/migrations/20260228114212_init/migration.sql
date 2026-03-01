-- CreateEnum
CREATE TYPE "TypeBien" AS ENUM ('MAISON', 'APPARTEMENT', 'STUDIO', 'TERRAIN', 'VILLA', 'BUREAU', 'COMMERCE');

-- CreateEnum
CREATE TYPE "StatutBien" AS ENUM ('DISPONIBLE', 'RESERVE', 'LOUE', 'VENDU', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "StatutVisite" AS ENUM ('DEMANDEE', 'CONFIRMEE', 'ANNULEE', 'EFFECTUEE');

-- CreateTable
CREATE TABLE "agences" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "agenceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biens" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "type" "TypeBien" NOT NULL,
    "adresse" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "statut" "StatutBien" NOT NULL DEFAULT 'DISPONIBLE',
    "agenceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "biens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visites" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "bienId" TEXT NOT NULL,
    "dateVisite" TIMESTAMP(3) NOT NULL,
    "statut" "StatutVisite" NOT NULL DEFAULT 'DEMANDEE',
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agences_code_key" ON "agences"("code");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "visites_clientId_bienId_dateVisite_key" ON "visites"("clientId", "bienId", "dateVisite");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_agenceId_fkey" FOREIGN KEY ("agenceId") REFERENCES "agences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biens" ADD CONSTRAINT "biens_agenceId_fkey" FOREIGN KEY ("agenceId") REFERENCES "agences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visites" ADD CONSTRAINT "visites_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visites" ADD CONSTRAINT "visites_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "biens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
