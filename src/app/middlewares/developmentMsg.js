const reply = require("../../scripts/reply")

async function developmentMsg (ctx, next) {
    
    if (process.env.NODE_ENV !== "development") {
        await next()
        return
    }

    if (ctx.from.id !== parseInt(process.env.MY_USER_ID) && ctx.from.id !== parseInt(process.env.TESTING_USER_ID)) {
        reply(ctx, '⚠️ Sorry, this bot is on development for now... \n\nStay alert for new updates! \n\nRepository: https://github.com/FranP-code/Telegram-to-Notion-Bot')
        return
    }

    next()
}

module.exports = developmentMsg