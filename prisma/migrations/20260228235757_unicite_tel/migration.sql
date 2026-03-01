/*
  Warnings:

  - A unique constraint covering the columns `[telephone]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "clients_telephone_key" ON "clients"("telephone");
