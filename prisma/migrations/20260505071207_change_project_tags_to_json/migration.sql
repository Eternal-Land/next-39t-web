/*
  Warnings:

  - You are about to alter the column `techStack` on the `hero_section` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.
  - You are about to alter the column `tags` on the `project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- DropIndex
DROP INDEX `account_userId_idx` ON `account`;

-- DropIndex
DROP INDEX `session_userId_idx` ON `session`;

-- AlterTable
ALTER TABLE `hero_section` MODIFY `techStack` JSON NOT NULL DEFAULT ('[]');

-- AlterTable
ALTER TABLE `project` MODIFY `tags` JSON NOT NULL DEFAULT ('[]');

-- CreateIndex
CREATE INDEX `account_userId_idx` ON `account`(`userId`(191));

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`(191));
