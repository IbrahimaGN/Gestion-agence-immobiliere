/*
  Warnings:

  - The primary key for the `agences` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `agences` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `biens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `biens` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `clients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `clients` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `visites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `visites` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `agenceId` on the `biens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `agenceId` on the `clients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `clientId` on the `visites` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `bienId` on the `visites` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "biens" DROP CONSTRAINT "biens_agenceId_fkey";

-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_agenceId_fkey";

-- DropForeignKey
ALTER TABLE "visites" DROP CONSTRAINT "visites_bienId_fkey";

-- DropForeignKey
ALTER TABLE "visites" DROP CONSTRAINT "visites_clientId_fkey";

-- AlterTable
ALTER TABLE "agences" DROP CONSTRAINT "agences_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "agences_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "biens" DROP CONSTRAINT "biens_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "agenceId",
ADD COLUMN     "agenceId" INTEGER NOT NULL,
ADD CONSTRAINT "biens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "clients" DROP CONSTRAINT "clients_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "agenceId",
ADD COLUMN     "agenceId" INTEGER NOT NULL,
ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "visites" DROP CONSTRAINT "visites_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clientId",
ADD COLUMN     "clientId" INTEGER NOT NULL,
DROP COLUMN "bienId",
ADD COLUMN     "bienId" INTEGER NOT NULL,
ADD CONSTRAINT "visites_pkey" PRIMARY KEY ("id");

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
