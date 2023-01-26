const reply = require('../../scripts/reply');

async function clearHandler(ctx, next) {
  if (ctx.session.waitingForClearConfirmation) {
    if (ctx.update.message.text.toLowerCase() === 'yes') {
      ctx.session.dataForAdd = [];
      reply(ctx, 'Cleared the cache 👌');
    } else {
      reply(ctx, 'Operation canceled. The cache was\'n cleaned');
    }
    ctx.session.waitingForClearConfirmation = false;
  } else {
    next();
  }
}

module.exports = clearHandler;
