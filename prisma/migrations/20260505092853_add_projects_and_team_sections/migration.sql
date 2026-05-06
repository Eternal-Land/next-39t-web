-- DropIndex
DROP INDEX `account_userId_idx` ON `account`;

-- DropIndex
DROP INDEX `session_userId_idx` ON `session`;

-- CreateTable
CREATE TABLE `projects_section` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_section` (
    `id` VARCHAR(191) NOT NULL,
    `badge` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `account_userId_idx` ON `account`(`userId`(191));

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`(191));
