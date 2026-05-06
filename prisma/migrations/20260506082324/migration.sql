/*
  Warnings:

  - The primary key for the `landing_page_info` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `landing_page_info` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `key` on the `landing_page_info` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - The primary key for the `project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `project` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `team_member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `team_member` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `contact_section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hero_section` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `account_userId_idx` ON `account`;

-- DropIndex
DROP INDEX `session_userId_idx` ON `session`;

-- AlterTable
ALTER TABLE `landing_page_info` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `key` ENUM('hero_title', 'hero_subtitle', 'hero_primary_button_text', 'hero_primary_button_link', 'hero_secondary_button_text', 'hero_secondary_button_link', 'contact_title', 'contact_subtitle', 'contact_email', 'contact_github', 'contact_facebook', 'contact_youtube', 'projects_title', 'projects_subtitle', 'team_badge', 'team_title', 'team_subtitle') NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `project` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `team_member` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `contact_section`;

-- DropTable
DROP TABLE `hero_section`;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `shortContent` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Post_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `account_userId_idx` ON `account`(`userId`(191));

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`(191));
