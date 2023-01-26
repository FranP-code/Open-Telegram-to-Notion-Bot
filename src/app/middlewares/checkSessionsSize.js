const reply = require('../../scripts/reply');

function checkSessionsSize(ctx, next) {
  let allTextsAreNull = true;

  ctx.session.dataForAdd.forEach((element) => {
    if (element !== null) {
      allTextsAreNull = false;
    }
  });

  if (allTextsAreNull) {
    ctx.session.dataForAdd = [];
  }

  const limit = process.env.NODE_ENV === 'production' ? 15 : 3;
  if (ctx.session.dataForAdd.length >= limit && !ctx.update?.callback_query?.data && ctx.update?.message.text !== '/clear') {
    reply(ctx, `There's ${ctx.session.dataForAdd.filter((data) => data !== null).length} messages waiting for be sended to Notion or be canceled. Please, define them and send again a message.`);
    return;
  }
  next();
}

module.exports = checkSessionsSize;
