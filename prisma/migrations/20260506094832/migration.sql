-- DropIndex
DROP INDEX `account_userId_idx` ON `account`;

-- DropIndex
DROP INDEX `session_userId_idx` ON `session`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft';

-- CreateIndex
CREATE INDEX `account_userId_idx` ON `account`(`userId`(191));

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`(191));
