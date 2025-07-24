# Fraktal Blocks Overview

**Fraktal** is a powerful no-code automation platform designed to connect decentralized, web2, and AI services through modular, composable units called **blocks**. With Fraktal, you can create workflows that respond to events (triggers) and perform actions across Telegram, Discord, GitHub, Web3 wallets, LLMs, and more — without writing custom backend code.



## What Are Blocks?

Blocks are the building units of a Fraktal automation. Each block either listens for an event (**Trigger**) or performs a task (**Action**). You can connect these blocks in flows to build powerful automations.

- **Triggers**: Start a flow when an external event occurs (e.g., message received, webhook fired).
- **Actions**: Perform a task in response to a trigger (e.g., send a message, call an AI model, query a wallet).

You can chain multiple actions and even conditionally branch logic using Fraktal’s visual flow editor.

---

## Triggers

These blocks initiate workflows when something happens in a connected app or service:

- **Telegram Trigger**: Start a workflow when a user sends a message to a Telegram bot.
    - Select event "New Message Recieved"
    - Enter your [Bot Token](https://docs.radist.online/docs/our-products/radist-web/connections/telegram-bot/instructions-for-creating-and-configuring-a-bot-in-botfather)
    - Click on "Set Webhook"
    - Select Export events


- **Discord Trigger**: Start a workflow when the Bot is mentioned in a Discord server.
    - Select event "Bot Mentioned"
    - Click on Deploy Fraktal Bot to add our [Discord bot](https://discord.com/oauth2/authorize?client_id=1395353699592704040&permissions=68736&integration_type=0&scope=bot) to your server.
    - Enter Guild/Server ID
    - Enter Channel ID
    - Click on Set webhook
    - Select Export data

- **GitHub Trigger**: Listen to events like pushes, pull requests, and issues via GitHub webhooks.
    - Select event type (e.g., "Issue Created", "Pull Request Opened", "Push to Branch")
    - You will get a link for your workflow.
    - Go to the GitHub repo → **Settings** → **Webhooks** → **Add webhook**
    - Paste the URL, set Content Type to `application/json`, and enable desired events
    - Click **Add webhook** and return to Fraktal to proceed with configuring blocks


## Actions

These blocks perform tasks after a trigger is fired:

- **Telegram Action**: Send messages or replies to users/groups via Telegram.
    
    - Select Action "Send Message"
    - Add Bot Token
    - Select/Enter Chat ID
    - Write Message

- **Discord Action**: Post messages in Discord channels, or DM users.

    - Select Action "Send Message"
    - Enter Guild/Channel ID or select them from Trigger.
    - Write Message

- **Email Action**: Send email notifications to recipients.

    - Select Action "Send Email"
    - Write "To Address"/Subject and Body (HTML/1000 chars max.) 

- **Web3 Wallet Action**: Query wallet balances & monitor wallet activity.

    - Select "Get wallet balance" action.
    - Enter Wallet Address
    - Select Blockchain Network
    - Export Wallet balance

- **Token Price Action**: Fetch live token prices from crypto markets and use them in your flows.

    -  Select action "Get token price"
    -  Select Token
    -  Export "Token Price"/"Percent change in Last 24 Hrs"


- **AI Action**: Leverage GPT-style LLMs to generate text dynamically in response to trigger data.

    - Select action "Generate Text"
    - Enter prompt
    - Export "Response"

---

## Why Use Fraktal?

- **Fast prototyping**: Build workflows in minutes with a drag-and-drop editor.
- **Modular blocks**: Mix and match triggers and actions across Web2, Web3, and AI.
- **Realtime automations**: React instantly to user or system events.
- **Built on Internet Computer (ICP)**:
  - No centralized servers or backend needed
  - Fully on-chain workflows with persistent storage
  - Censorship-resistant and tamper-proof execution
  - Low-latency and low-cost infrastructure for automations

---

### Explore More

Visit [**Fraktal**](https://x.com/fraktal_app) to explore the full platform and start building your own automations.
