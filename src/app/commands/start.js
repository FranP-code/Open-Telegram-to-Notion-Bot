const reply = require("../../scripts/reply")

function start(ctx) {
    reply(ctx, `Welcome to the <strong>Telegram to Notion Bot</strong>\n\nPlease, expect that sometimes the bot is down, it is very complex and it falls down easily. It will be online as soon as possible!! 🙌\n\nType /auth for authorize the bot`, {parse_mode: "HTML"})
}

module.exports = start