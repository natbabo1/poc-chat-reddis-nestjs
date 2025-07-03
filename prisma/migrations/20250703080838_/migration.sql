/*
  Warnings:

  - A unique constraint covering the columns `[pairKey]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "pairKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Room_pairKey_key" ON "Room"("pairKey");

-- CreateIndex
CREATE INDEX "Room_type_pairKey_idx" ON "Room"("type", "pairKey");
