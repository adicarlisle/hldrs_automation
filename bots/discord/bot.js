require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { makeCommands, handleMessage } = require('./commands');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const commands = makeCommands(() => client.ws.ping);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  handleMessage(message, commands);
});

client.login(process.env.DISCORD_TOKEN);
