const AppController = require('../../controller/AppController')

async function onText(ctx) {

    //Get databases
    const databases = await AppController().getNotionDatabases(ctx.from.id)

    if (databases.status === "error") {
        
        switch (databases.message) {
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

    //Delete the item in the textsForAdd in...
    setTimeout(cleanArray, 5 * 60 * 1000) //5 Minutes

    const botReply = text.length > 20 ? "\n\n" + text : text

    //Generate Keyboard from the databases
    const keyboard = await AppController().getKeyboardOfDatabases(databases.results, null, "text", ctx.session.textsForAdd)

    ctx.reply(`Select the <strong>database</strong> to save <strong>${botReply}</strong>`, {...keyboard, parse_mode: "HTML"})
}

module.exports = onText