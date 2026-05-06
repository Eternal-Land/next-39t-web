-- DropIndex
DROP INDEX `account_userId_idx` ON `account`;

-- DropIndex
DROP INDEX `session_userId_idx` ON `session`;

-- CreateTable
CREATE TABLE `hero_section` (
    `id` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `subtitle` TEXT NOT NULL,
    `primaryButtonText` VARCHAR(191) NOT NULL,
    `primaryButtonLink` VARCHAR(191) NOT NULL,
    `secondaryButtonText` VARCHAR(191) NOT NULL,
    `secondaryButtonLink` VARCHAR(191) NOT NULL,
    `techStack` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `tags` TEXT NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_member` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `avatar` TEXT NULL,
    `initials` VARCHAR(191) NOT NULL,
    `github` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_section` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `github` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `account_userId_idx` ON `account`(`userId`(191));

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`(191));
