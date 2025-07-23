import express, { Request } from 'express';

import ExecutionQueue from './executionQueue'
import { telegramTriggerWebhook } from './blocks/telegram/telegram';
import { discordTriggerWebhook } from './blocks/discord/discord';

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Running");
})

app.get("/queue", (req, res) => {
    res.send(JSON.stringify(ExecutionQueue.showQueue()));
})

app.post("/webhook/telegram/:userId/:workflowId/", telegramTriggerWebhook)
app.post("/webhook/discord/:userId/:workflowId/", discordTriggerWebhook)

app.listen();
