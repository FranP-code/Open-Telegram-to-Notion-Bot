async function onText(ctx) {

    const AppController = require('../../controller/AppController')

    const response = await AppController().getNotionDatabases(ctx.from.id)

    if (response.status === "error") {
        
        switch (response.message) {
            case "no auth code":
                ctx.reply('No auth code provided\n*Use the /auth command for provide it*', {parse_mode: "MarkdownV2"})
                break;
        
            default:
                ctx.reply('Unknow error\n*Try again later*', {parse_mode: "MarkdownV2"})
                break;
        }

        return
    }

    //Add text to array of texts
    const text = ctx.message.text.trim()
    ctx.session.textsForAdd.push(text)

    //If pass some time delete the text on the array
    function cleanArray() {
        if (ctx.session.textsForAdd.includes(text)) {
            const index = ctx.session.textsForAdd.indexOf(text)
            ctx.session.textsForAdd.splice(index, 1)
        }
    }

    setTimeout(cleanArray, 5 * 60 * 1000)

    const botReply = text.length > 20 ? "\n\n" + text : text

    ctx.reply(`Select the <strong>database</strong> to save <strong>${botReply}</strong>`, {
        reply_markup: {
            inline_keyboard: [
                ...response.results.map((obj) => {
                        const title = obj.title.length <= 0 ?  "Untitled" : obj.title[0].text.content

                        if (obj.properties.telegramIgnore) {
                            return []
                        }

                        if (obj.icon) {
                            return [{
                                text: `${obj.icon.emoji ? obj.icon.emoji + " " : ""}${title}`,
                                callback_data: "database_id" + obj.id + "text_index" + JSON.stringify(ctx.session.textsForAdd.length - 1)
                            }]
                        } else {
                            return [{
                                text: title,
                                callback_data: "database_id" + obj.id + "text_index" + JSON.stringify(ctx.session.textsForAdd.length - 1)
                            }]
                        }
                    }),
                    [
                        {text: "🚫", callback_data: "cancel_operation"}
                    ]
                ]
        },
        parse_mode: "HTML"
    })
}

module.exports = onText