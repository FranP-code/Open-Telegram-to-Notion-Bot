function help(ctx) {
    ctx.reply(
        `
• The repository of this bot on <strong>Github</strong>:
  https://github.com/FranP-code/Telegram-to-Notion-Bot

• The <strong>website</strong> of this project:
  https://telegram-to-notion-bot.netlify.app
        `, {parse_mode: "HTML"})
}

module.exports = help