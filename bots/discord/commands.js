const PREFIX = '!';

function makeCommands(getApiPing) {
  return {
    test: (message) => {
      message.reply('✅ Bot is online and working!');
    },

    ping: (message) => {
      const latency = Date.now() - message.createdTimestamp;
      message.reply(`🏓 Pong! Latency: **${latency}ms** | API: **${getApiPing()}ms**`);
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
}

function handleMessage(message, commands) {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (commands[command]) {
    commands[command](message, args);
  }
}

module.exports = { makeCommands, handleMessage, PREFIX };
