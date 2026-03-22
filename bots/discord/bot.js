require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const PREFIX = '!';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Command handlers
const commands = {
  test: (message) => {
    message.reply('✅ Bot is online and working!');
  },

  ping: (message) => {
    const latency = Date.now() - message.createdTimestamp;
    message.reply(`🏓 Pong! Latency: **${latency}ms** | API: **${client.ws.ping}ms**`);
  },

  hello: (message) => {
    message.reply(`👋 Hello, ${message.author.username}! Welcome to hldrs.`);
  },

  help: (message) => {
    const helpText = [
      '**hldrs Bot Commands**',
      '`!test`  — Check if the bot is online',
      '`!ping`  — Check bot latency',
      '`!hello` — Get a greeting',
      '`!help`  — Show this message',
    ].join('\n');
    message.reply(helpText);
  },
};

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  // Ignore bots and messages without the prefix
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (commands[command]) {
    commands[command](message, args);
  }
});

client.login(process.env.DISCORD_TOKEN);
