/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sessions" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sessions_email_key" ON "Sessions"("email");
