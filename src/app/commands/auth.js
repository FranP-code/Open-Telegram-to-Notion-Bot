function auth(ctx) {
    ctx.session.waitingForAuthCode = true
    
    ctx.reply(`Tap here 👇 for authorize the bot on Notion and paste the resulting code`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Authorize",
                        url: `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${process.env.NOTION_INTEGRATION_ID}&redirect_uri=https://telegram-to-notion-bot.netlify.app/auth&response_type=code`
                    }
                ]
            ]
        }
    })
}

module.exports = auth 