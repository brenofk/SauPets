/*
  Warnings:

  - You are about to drop the column `senha_hash` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `tipo` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pet` ADD COLUMN `tipo` ENUM('Cachorro', 'Gato', 'Passaro', 'Outro') NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `senha_hash`,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL;
