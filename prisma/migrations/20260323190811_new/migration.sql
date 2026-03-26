/*
  Warnings:

  - A unique constraint covering the columns `[matricule]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "matricule" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "clients_matricule_key" ON "clients"("matricule");
