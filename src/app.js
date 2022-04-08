const { Bot, session } = require('grammy')
require('dotenv').config()

const bot = new Bot(process.env.BOT_TOKEN)

// Setting default session for user
function initialSesionValues() {
    return {waitingForAuthCode: false};
}

bot.use(session({ initial: initialSesionValues }));

// Set a middleware for reject other users when the bot is on development
bot.use(async (ctx, next) => {
    
    if (process.env.NODE_ENV !== "development") {
        return
    }

    if (ctx.from.id !== parseInt(process.env.MY_USER_ID)) {
        ctx.reply('⚠️ Sorry, this bot is on development for now... \nStay alert for new updates! \nrepo: https://github.com/FranP-code/Telegram-to-Notion-Bot')
        return
    }

    await next()
})

//Set a middleware for check if the bot is waiting the auth code
bot.use(async (ctx, next) => {
    if (ctx.session.waitingForAuthCode) {
        
        ctx.reply("Auth code added to database")
        ctx.session.waitingForAuthCode = false
        
        return
    } else {
        await next()
    }
})

//Welcome message
bot.command('start', ctx => {

    ctx.reply(`Welcome to the *Telegram to Notion Bot*\n\nWith this bot you can send any text message and add it to one database on Notion\n\nType /auth for authorize the bot`, {parse_mode: "MarkdownV2"})
    
})

// Auth message sending
bot.command('auth', ctx => {
    ctx.session.waitingForAuthCode = true
    
    ctx.reply(`Tap here 👇 for authorize the bot on Notion and paste the resulting code`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Authorize",
                        url: `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${process.env.NOTION_INTEGRATION_ID}&redirect_uri=https://telegram-to-notion.herokuapp.com/auth&response_type=code`
                    }
                ]
            ]
        }
    })
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.start()

// Fuck Telegraf
// My hommies and I hate Telegraf
// Grammy for the win