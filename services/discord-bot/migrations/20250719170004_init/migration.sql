-- CreateTable
CREATE TABLE "guild_workflows" (
    "guild_id" TEXT NOT NULL,
    "workflow_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "guild_workflows_pkey" PRIMARY KEY ("guild_id")
);
