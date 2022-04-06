const { Telegraf } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

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

bot.start(ctx => {
    ctx.reply('Hi!')
    console.log(ctx.from)
})

bot.launch()