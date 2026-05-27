/*
  Warnings:

  - A unique constraint covering the columns `[productId,createdById]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_productId_createdById_key" ON "Review"("productId", "createdById");
