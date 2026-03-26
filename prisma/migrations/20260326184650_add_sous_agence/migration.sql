/*
  Warnings:

  - A unique constraint covering the columns `[code,sousAgence]` on the table `agences` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "agences" ADD COLUMN     "sousAgence" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "agences_code_sousAgence_key" ON "agences"("code", "sousAgence");
