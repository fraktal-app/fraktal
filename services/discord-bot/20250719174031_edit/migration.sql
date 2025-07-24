/*
  Warnings:

  - The primary key for the `guild_workflows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[guild_id,channel_id]` on the table `guild_workflows` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "guild_workflows" DROP CONSTRAINT "guild_workflows_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "guild_workflows_guild_id_channel_id_key" ON "guild_workflows"("guild_id", "channel_id");
