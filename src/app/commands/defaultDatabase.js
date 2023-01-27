const AppController = require('../../controller/AppController');
const reply = require('../../scripts/reply');

async function defaultDatabase(ctx) {
  const databases = await AppController.notion.getDatabases(ctx?.from?.id);
  const keyboard = AppController.generateKeyboard.databases(
    databases.results,
    null,
    'text',
    ctx.session.dataForAdd,
  );
  await reply(
    ctx,
    'Select a <strong>database</strong> to set as default',
    keyboard,
  );
  ctx.session.waitingForDefaultDatabaseSelection = true;
}

module.exports = defaultDatabase;
