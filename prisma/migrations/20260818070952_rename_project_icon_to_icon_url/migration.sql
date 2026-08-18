/*
  Warnings:

  - You are about to drop the column `icon` on the `project` table. All the data in the column will be lost.
  - Added the required column `iconUrl` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `account_userId_idx` ON `account`;

-- DropIndex
DROP INDEX `session_userId_idx` ON `session`;

-- AlterTable
ALTER TABLE `project` CHANGE COLUMN `icon` `iconUrl` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `account_userId_idx` ON `account`(`userId`(191));

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`(191));
