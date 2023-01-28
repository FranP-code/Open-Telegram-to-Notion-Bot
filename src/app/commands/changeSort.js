const AppController = require('../../controller/AppController');
const reply = require('../../scripts/reply');

async function changeSort(ctx) {
  const databases = await AppController.notion.getDatabases(ctx?.from?.id);
  const keyboard = AppController.generateKeyboard.databases(
    databases.results,
    null,
    'text',
    ctx.session.dataForAdd,
  );
  await reply(
    ctx,
    'Select a <strong>database</strong> to change his sort',
    keyboard,
  );
  ctx.session.waitingForChangeSortDatabaseSelection = true;
}

module.exports = changeSort;
