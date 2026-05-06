/*
  Warnings:

  - You are about to drop the `projects_section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_section` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `account_userId_idx` ON `account`;

-- DropIndex
DROP INDEX `session_userId_idx` ON `session`;

-- DropTable
DROP TABLE `projects_section`;

-- DropTable
DROP TABLE `team_section`;

-- CreateTable
CREATE TABLE `landing_page_info` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,

    UNIQUE INDEX `landing_page_info_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `account_userId_idx` ON `account`(`userId`(191));

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`(191));
