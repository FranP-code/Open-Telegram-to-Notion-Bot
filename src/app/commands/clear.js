const reply = require('../../scripts/reply');

async function clear(ctx) {
  reply(ctx, 'This is gonna clear all your messages from the cache.\n\nThe messages don\'t sent to Notion are gonna be <strong>permanently deleted</strong>.\n\nAre you sure? \nType <strong>Yes</strong> to confirm.');
  ctx.session.waitingForClearConfirmation = true;
}

module.exports = clear;
