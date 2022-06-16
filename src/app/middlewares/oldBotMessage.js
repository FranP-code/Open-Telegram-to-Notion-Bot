function oldBotMessage(ctx, next) {

    if (process.env.OLD_BOT === "true") {
        ctx.reply(`Hello, this bot <strong>it's not working anymore on this username</strong>.\nPlease use it in his new username 👇\n\nhttps://t.me/OpenTelegramToNotionBot`, {parse_mode: "HTML"})
    } else {
        next()
    }
}

module.exports = oldBotMessage