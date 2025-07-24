import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { Client, IntentsBitField, Events } from 'discord.js';
import express from 'express';
import cors from 'cors';
import { BOT_TOKEN, WEBHOOK_URL, INTERNAL_PORT } from './config/constants.js';

console.log('🔧 Starting Discord Bot...');
console.log('🔧 Environment check:');
console.log('- BOT_TOKEN:', BOT_TOKEN ? '✅ Present' : '❌ Missing');
console.log('- WEBHOOK_URL:', WEBHOOK_URL ? '✅ Present' : '❌ Missing');
console.log('- INTERNAL_PORT:', INTERNAL_PORT);

const intents = new IntentsBitField([
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
]);

const client = new Client({ intents });

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.on(Events.GuildCreate, async (guild) => {
  console.log(`🏰 Bot added to guild: ${guild.name} (${guild.id})`);
  try {
    const channel = guild.channels.cache
      .filter(c => c.isTextBased() && c.permissionsFor(guild.members.me).has('SendMessages'))
      .sort((a, b) => a.position - b.position)
      .first();

    const auditLogs = await guild.fetchAuditLogs({ type: 28, limit: 1 }).catch(() => null);
    const botAddEntry = auditLogs?.entries.find(entry => entry.target.id === client.user.id);
    const inviter = botAddEntry?.executor;

    if (inviter) {
      const dmContent = `✅ Thanks for adding the bot to **${guild.name}**!\n\nPaste this info in your config:\nGuild ID: \`${guild.id}\`\nSuggested Channel ID: \`${channel?.id ?? 'N/A'}\``;

      try {
        await inviter.send(dmContent);
        console.log(`📩 Sent DM to inviter (${inviter.tag}) for guild ${guild.name}`);
      } catch (dmErr) {
        console.warn(`⚠️ Couldn't DM inviter (${inviter.tag}), possibly DMs are closed.`);
        if (channel) {
          await channel.send(dmContent);
        }
      }
    } else {
      console.warn(`⚠️ Could not determine who added the bot to ${guild.name}`);
      if (channel) {
        await channel.send(`Paste this GuildId: \`${guild.id}\`, ChannelId: \`${channel.id}\` in Workflow configuration.`);
      }
    }
  } catch (e) {
    console.error('❌ Failed to send setup message:', e);
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;
  if (message.mentions.has(client.user.id)) {
    console.log(`👋 Mention detected from ${message.author.tag} in #${message.channel.name}`);

    const clean_content = message.content.replaceAll(
      new RegExp(`<@!?${client.user.id}>`, 'g'),
      ''
    ).trim();

    const authorRoles =
      message.member?.roles.cache
        .filter((role) => role.name !== '@everyone')
        .map((role) => role.name) ?? [];

    const basePayload = {
      message_id: message.id,
      content: message.content,
      clean_content,
      timestamp_utc: message.createdAt.toISOString(),
      author_name: message.author.username,
      author_discriminator: message.author.discriminator,
      author_display_name: message.member?.displayName ?? message.author.username,
      author_id: message.author.id,
      author_is_bot: message.author.bot,
      author_roles: authorRoles,
      channel_name: message.channel.name,
      channel_id: message.channel.id,
      server_name: message.guild.name,
      server_id: message.guild.id,
    };

    try {
      console.log('🔍 Looking up workflow config for guild:', message.guild.id, 'channel:', message.channel.id);
      
      const record = await prisma.guildWorkflow.findFirst({
        where: {
          guild_id: message.guild.id,
          channel_id: message.channel.id,
        },
        select: {
          workflow_id: true,
          user_id: true,
        },
      });

      console.log('🔍 Workflow config found:', record);

      if (!record || !record.workflow_id || !record.user_id) {
        throw new Error('⚠️ No workflow/user_id configured for this channel. Please paste them in the configuration.');
      }

      const dynamicWebhookUrl = `${WEBHOOK_URL}/${record.user_id}/${record.workflow_id}/`;
      console.log('📤 Sending to webhook URL:', dynamicWebhookUrl);

      const webhookResult = await fetch(dynamicWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basePayload),
      });

      console.log(`📤 Webhook response status: ${webhookResult.status}`);
      
      if (!webhookResult.ok) {
        const errorText = await webhookResult.text().catch(() => 'Unable to read error');
        throw new Error(`❌ Webhook error: ${webhookResult.status} - ${errorText}`);
      }

      await message.react('✅');
      console.log('✅ Message processed successfully');
    } catch (e) {
      console.error('❌ Error processing message:', e);
      await message.react('❌');
    }
  }
});

function startInternalWebhookServer() {
  console.log('🔧 Starting internal webhook server...');
  
  try {
    const app = express();
    
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('❌ Express error:', err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    });
    
    // Apply CORS BEFORE other middleware
    app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'ngrok-skip-browser-warning'],
      credentials: false,
      preflightContinue: false,
      optionsSuccessStatus: 200
    }));
    
    console.log('✅ CORS middleware applied');
    
    // Handle preflight requests for all routes
    app.options('*', cors());
    
    // JSON parsing middleware after CORS
    app.use(express.json());
    
    // Add explicit CORS headers for all responses
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
      next();
    });

    // Request logging middleware
    app.use((req, res, next) => {
      console.log(`📥 ${req.method} ${req.path} from ${req.ip}`);
      next();
    });

    app.post('/send-message', async (req, res) => {
      console.log('📨 Send message request:', req.body);
      
      const { guild_id, channel_id, content } = req.body;
      if (!guild_id || !channel_id || !content) {
        return res.status(400).json({ error: 'Missing guild_id, channel_id, or content' });
      }

      try {
        const guild = await client.guilds.fetch(guild_id).catch(() => null);
        if (!guild) {
          console.log('❌ Invalid guild_id:', guild_id);
          return res.status(404).json({ error: 'Invalid guild_id' });
        }

        const channel = await guild.channels.fetch(channel_id).catch(() => null);
        if (!channel || !channel.isTextBased()) {
          console.log('❌ Invalid channel_id:', channel_id);
          return res.status(404).json({ error: 'Invalid channel_id' });
        }

        await channel.send(content);
        console.log('✅ Message sent successfully');
        return res.json({ success: true });
      } catch (e) {
        console.error('❌ Send message error:', e);
        return res.status(500).json({ error: e.message });
      }
    });

    app.get('/configure', async (req, res) => {
      const { guild_id, channel_id, workflow_id, user_id } = req.query;
      
      console.log('📝 Configure request received:', { guild_id, channel_id, workflow_id, user_id });
      console.log('📝 Request headers:', req.headers);
      
      if (!guild_id || !channel_id || !workflow_id || !user_id) {
        console.log('❌ Missing parameters in configure request');
        return res.status(400).json({ error: 'Missing guild_id, channel_id, workflow_id, or user_id' });
      }
      
      try {
        console.log('💾 Saving to database...');
        await prisma.guildWorkflow.upsert({
          where: { guild_id_channel_id: { guild_id, channel_id } },
          update: { workflow_id, user_id },
          create: { guild_id, channel_id, workflow_id, user_id },
        });
        
        const response = { success: true, msg: `✅ Saved for guild_id=${guild_id}, channel_id=${channel_id}` };
        console.log('📝 Sending response:', response);
        
        return res.json(response);
      } catch (e) {
        console.error('❌ Configure error:', e);
        return res.status(500).json({ error: e.message });
      }
    });

    // Add a test endpoint to verify CORS is working
    app.get('/test', (req, res) => {
      console.log('🧪 Test endpoint called');
      res.json({ message: 'CORS test successful', timestamp: new Date().toISOString() });
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        botConnected: client.isReady() 
      });
    });

    const PORT = process.env.PORT || INTERNAL_PORT;

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Internal server running at http://localhost:${PORT}`);
      console.log(`→ POST /send-message`);
      console.log(`→ GET /configure`);
      console.log(`→ GET /test (CORS test endpoint)`);
      console.log(`→ GET /health (Health check)`);
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
    });

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    throw error;
  }
}

client.once(Events.ClientReady, () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
  console.log(`🏰 Bot is in ${client.guilds.cache.size} guilds`);
  
  try {
    startInternalWebhookServer();
    console.log('✅ Internal webhook server started successfully');
  } catch (error) {
    console.error('❌ Failed to start internal webhook server:', error);
    process.exit(1);
  }
});

console.log('🔧 Attempting to login bot...');
client.login(BOT_TOKEN).catch((error) => {
  console.error('❌ Failed to login bot:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});