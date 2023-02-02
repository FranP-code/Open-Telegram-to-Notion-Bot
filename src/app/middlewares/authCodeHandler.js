const DatabaseQuerys = require('../../controller/DatabaseQuerys');
const reply = require('../../scripts/reply');

async function authCodeHandler(ctx, next) {
  if (ctx.session.waitingForAuthCode) {
    ctx.session.waitingForAuthCode = false;

    const response = await DatabaseQuerys().uploadApiKey(ctx.from.id, ctx.message.text);

    let message;

    if (response.status === 'success') {
      await DatabaseQuerys().removeDefaultDatabase(ctx.from.id);
      message = 'Auth code registered 👍\n\nSend a message to <strong>add it to the database you select</strong>';
    }

    if (response.status === 'error') {
      if (response.message === 'Auth key not valid') {
        message = 'Auth code not valid, type /auth again';
      } else {
        message = 'Unknow error, please try again later';
      }
    }

    reply(ctx, message);
  } else {
    await next();
  }
}

module.exports = authCodeHandler;
