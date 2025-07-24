import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const INTERNAL_PORT = process.env.INTERNAL_PORT || 5000;

if (!BOT_TOKEN) throw new Error('BOT_TOKEN is required');
if (!WEBHOOK_URL) throw new Error('WEBHOOK_URL is required');

export { BOT_TOKEN, WEBHOOK_URL, INTERNAL_PORT };
