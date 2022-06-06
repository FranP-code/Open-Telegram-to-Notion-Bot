const { Bot, session } = require('grammy');
require('dotenv').config()

//Middlewares
const developmentMsg = require('./middlewares/developmentMsg');
const authCodeHandler = require('./middlewares/authCodeHandler');
const announcementHandler = require('./middlewares/announcementHandler');
const chatAction = require('./middlewares/chatAction');
const cleanSessions = require('./middlewares/cleanSessions');

//Commands
const start = require('./commands/start');
const auth = require('./commands/auth');
const help = require('./commands/help');
const announcement = require('./commands/announcement');
const roadmap = require('./commands/roadmap');
const feedback = require('./commands/feedback');

//Events
const onText = require('./events/onText');
const onCallbackQuery = require('./events/onCallbackQuery');
const onPhoto = require('./events/onPhoto');

const bot = new Bot(process.env.BOT_TOKEN)


//* ---------------- MIDDLEWARES ----------------


// Setting default session for user
function initialSesionValues() {
    return {
        waitingForAuthCode: false,
        waitingForAnnouncementMessage: false,
        dataForAdd: [],
        waitingForPropiertyValue: false
    };
}

bot.use(session({ initial: initialSesionValues }));

// Set a middleware for reject other users when the bot is on development
bot.use(developmentMsg)

//Set a middleware for check if the bot is waiting the auth code and save it on Database
bot.use(authCodeHandler)

//Set a middleware for check if the bot is waiting the announcement and make it
bot.use(announcementHandler)

//Set a middleware for send a 'typing' state every time the bot is called
bot.use(chatAction)

//Set a middleware for check if for each session array, one is full of null objects. In that case, clean it
bot.use(cleanSessions)


//* ---------------- COMMANDS ----------------


// Start command
bot.command('start', start)

// Auth message sending
bot.command('auth', auth)

// Help command
bot.command('help', help)

// Announcement command
bot.command("announcement", announcement)

// Roadmap command
bot.command("roadmap", roadmap)

// Feedback command
bot.command("feedback", feedback)

/*
 * Little note: all the commands are before the events of the bot
*/


//* ---------------- EVENTS ----------------


// On the message sending, exec the main function of the bot
bot.on(':text', onText)

//Handle the button pressed for the user
bot.on("callback_query:data", onCallbackQuery)

bot.on(':photo', onPhoto)

bot.on(':sticker', ctx => {
    ctx.reply('❤️')
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.start()

// Fuck Telegraf
// My hommies and I hate Telegraf
// Grammy for the win
