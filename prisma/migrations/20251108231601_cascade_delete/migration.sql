-- DropForeignKey
ALTER TABLE `documento` DROP FOREIGN KEY `Documento_pet_id_fkey`;

-- DropForeignKey
ALTER TABLE `lembrete` DROP FOREIGN KEY `Lembrete_pet_id_fkey`;

-- DropForeignKey
ALTER TABLE `lembrete` DROP FOREIGN KEY `Lembrete_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `pet` DROP FOREIGN KEY `Pet_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `vacina` DROP FOREIGN KEY `Vacina_pet_id_fkey`;

-- DropIndex
DROP INDEX `Documento_pet_id_fkey` ON `documento`;

-- DropIndex
DROP INDEX `Lembrete_pet_id_fkey` ON `lembrete`;

-- DropIndex
DROP INDEX `Vacina_pet_id_fkey` ON `vacina`;

-- AddForeignKey
ALTER TABLE `Pet` ADD CONSTRAINT `Pet_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vacina` ADD CONSTRAINT `Vacina_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `Pet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `Pet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lembrete` ADD CONSTRAINT `Lembrete_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lembrete` ADD CONSTRAINT `Lembrete_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `Pet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
