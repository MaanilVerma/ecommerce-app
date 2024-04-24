/*
  Warnings:

  - You are about to drop the `Pin` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" TEXT;

-- DropTable
DROP TABLE "Pin";
