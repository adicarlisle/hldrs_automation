const { describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');
const { makeCommands, handleMessage, PREFIX } = require('../bots/discord/commands');

// Helper — creates a fake Discord message object
function fakeMessage({ content = '', username = 'testuser', isBot = false, createdTimestamp = Date.now() } = {}) {
  return {
    content,
    author: { username, bot: isBot },
    createdTimestamp,
    reply: mock.fn(),
  };
}

const commands = makeCommands(() => 42); // fixed API ping of 42ms

describe('!test command', () => {
  it('replies with online confirmation', () => {
    const message = fakeMessage();
    commands.test(message);
    assert.equal(message.reply.mock.calls.length, 1);
    assert.ok(message.reply.mock.calls[0].arguments[0].includes('online'));
  });
});

describe('!ping command', () => {
  it('replies with latency info', () => {
    const message = fakeMessage({ createdTimestamp: Date.now() - 50 });
    commands.ping(message);
    const reply = message.reply.mock.calls[0].arguments[0];
    assert.ok(reply.includes('Pong'));
    assert.ok(reply.includes('42ms')); // API ping from mock
  });
});

describe('!hello command', () => {
  it('greets the user by username', () => {
    const message = fakeMessage({ username: 'zezima' });
    commands.hello(message);
    const reply = message.reply.mock.calls[0].arguments[0];
    assert.ok(reply.includes('zezima'));
  });
});

describe('!help command', () => {
  it('lists all commands', () => {
    const message = fakeMessage();
    commands.help(message);
    const reply = message.reply.mock.calls[0].arguments[0];
    assert.ok(reply.includes('!test'));
    assert.ok(reply.includes('!ping'));
    assert.ok(reply.includes('!hello'));
    assert.ok(reply.includes('!help'));
  });
});

describe('handleMessage', () => {
  it('ignores bot messages', () => {
    const message = fakeMessage({ content: '!test', isBot: true });
    handleMessage(message, commands);
    assert.equal(message.reply.mock.calls.length, 0);
  });

  it('ignores messages without the prefix', () => {
    const message = fakeMessage({ content: 'test' });
    handleMessage(message, commands);
    assert.equal(message.reply.mock.calls.length, 0);
  });

  it('ignores unknown commands', () => {
    const message = fakeMessage({ content: '!unknowncommand' });
    handleMessage(message, commands);
    assert.equal(message.reply.mock.calls.length, 0);
  });

  it('routes !test to the test command', () => {
    const message = fakeMessage({ content: '!test' });
    handleMessage(message, commands);
    assert.equal(message.reply.mock.calls.length, 1);
  });

  it('routes commands case-insensitively', () => {
    const message = fakeMessage({ content: '!TEST' });
    handleMessage(message, commands);
    assert.equal(message.reply.mock.calls.length, 1);
  });
});
