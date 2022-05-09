function start(ctx) {
    ctx.reply(`Welcome to the *Telegram to Notion Bot*\n\nWith this bot you can send any text message and add it to one database on Notion\n\nType /auth for authorize the bot`, {parse_mode: "MarkdownV2"})
}

module.exports = start