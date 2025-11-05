-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha_hash` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `sexo` ENUM('M', 'F') NOT NULL,
    `peso` DECIMAL(65, 30) NULL,
    `foto_url` VARCHAR(191) NULL,

    INDEX `Pet_usuario_id_idx`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vacina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pet_id` INTEGER NOT NULL,
    `nome_vacina` VARCHAR(191) NOT NULL,
    `data_aplicacao` DATETIME(3) NULL,
    `data_reforco` DATETIME(3) NULL,
    `veterinario` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pet_id` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `tipo` ENUM('carteira_vacinacao', 'exame', 'receita', 'outro') NOT NULL,
    `arquivo_url` VARCHAR(191) NOT NULL,
    `data_upload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lembrete` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `pet_id` INTEGER NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `data_evento` DATETIME(3) NOT NULL,
    `notificado` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Lembrete_usuario_id_pet_id_idx`(`usuario_id`, `pet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pet` ADD CONSTRAINT `Pet_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vacina` ADD CONSTRAINT `Vacina_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `Pet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `Pet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lembrete` ADD CONSTRAINT `Lembrete_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lembrete` ADD CONSTRAINT `Lembrete_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `Pet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
