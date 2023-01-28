/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
const {
  Bot, session, GrammyError, HttpError,
} = require('grammy');
require('dotenv').config();

// Middlewares
const developmentMsg = require('./middlewares/developmentMsg');
const authCodeHandler = require('./middlewares/authCodeHandler');
const announcementHandler = require('./middlewares/announcementHandler');
const chatAction = require('./middlewares/chatAction');
const checkSessionsSize = require('./middlewares/checkSessionsSize');
const oldBotMessage = require('./middlewares/oldBotMessage');
const clearHandler = require('./middlewares/clearHandler');

// Commands
const start = require('./commands/start');
const auth = require('./commands/auth');
const help = require('./commands/help');
const announcement = require('./commands/announcement');
const roadmap = require('./commands/roadmap');
const feedback = require('./commands/feedback');
const clear = require('./commands/clear');

// Events
const onText = require('./events/onText');
const onCallbackQuery = require('./events/onCallbackQuery');
const onPhoto = require('./events/onPhoto');
const reply = require('../scripts/reply');
const defaultDatabase = require('./commands/defaultDatabase');

const bot = new Bot(
  process.env.OLD_BOT === 'true' ? process.env.BOT_TOKEN_OLD
    : process.env.NODE_ENV === 'production' ? process.env.BOT_TOKEN_PROD : process.env.BOT_TOKEN_DEV,
);

bot.api.sendMessage(process.env.MY_USER_ID, 'working', { parse_mode: 'HTML' });

bot.catch((err, next) => {
  const { ctx } = err;
  console.log(`Error while handling update ${ctx.update.update_id}:`);
  bot.api.sendMessage(process.env.MY_USER_ID, `broke 💀\n\n${err}`, { parse_mode: 'HTML' });
  const e = err.error;
  if (e instanceof GrammyError) {
    console.log('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.log('Could not contact Telegram:', e);
  } else {
    console.log('Unknown error:', e);
  }
  next();
});

//* ---------------- MIDDLEWARES ----------------

// Setting default session for user
function initialSesionValues() {
  return {
    waitingForAuthCode: false,
    waitingForAnnouncementMessage: false,
    dataForAdd: [],
    waitingForPropiertyValue: false,
    waitingForDefaultDatabaseSelection: false,
  };
}

bot.use(session({ initial: initialSesionValues }));

// Set a middleware for reject other users when the bot is on development
bot.use(developmentMsg);

// Set a middleware for check if the bot is waiting the auth code and save it on Database
bot.use(authCodeHandler);

// Set a middleware for check if the bot is waiting the announcement and make it
bot.use(announcementHandler);

// Clear command handler
bot.use(clearHandler);

// Set a middleware for send a 'typing' state every time the bot is called
bot.use(chatAction);

// Set old bot message middleware
bot.use(oldBotMessage);

//! Keep at bottom of the middlewares
bot.use(checkSessionsSize);

//* ---------------- COMMANDS ----------------

// Start command
bot.command('start', start);

// Auth message sending
bot.command('auth', auth);

// Help command
bot.command('help', help);

// Announcement command
bot.command('announcement', announcement);

// Roadmap command
bot.command('roadmap', roadmap);

// Feedback command
bot.command('feedback', feedback);

// Clear command
bot.command('clear', clear);

bot.command('defaultdatabase', defaultDatabase);

/*
 * Little note: all the commands are before the events of the bot
*/

//* ---------------- EVENTS ----------------

// On the message sending, exec the main function of the bot
bot.on(':text', onText);

// Handle the button pressed for the user
bot.on('callback_query:data', onCallbackQuery);

bot.on(':photo', onPhoto);

bot.on(':sticker', (ctx) => {
  reply(ctx, '❤️');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.start();

// Fuck Telegraf
// My hommies and I hate Telegraf
// Grammy for the win
