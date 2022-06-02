const AppController = require('../../controller/AppController.js')

async function onPhoto(ctx) {
    const data = await ctx.getFile()

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

    //If the message have a caption, set it as title propierty
    if (ctx.update.message.caption) {
        data.title = ctx.update.message.caption
    }

    //Add image to array of texts
    ctx.session.imagesForAdd.push(data)

    //If pass some time delete the text on the array
    function cleanArray() {
        if (ctx.session.imagesForAdd.includes(data)) {
            const index = ctx.session.imagesForAdd.indexOf(data)
            ctx.session.imagesForAdd.splice(index, 1)
        }
    }

    //Delete the item in the imagesForAdd in...
    setTimeout(cleanArray, 5 * 60 * 1000) //5 Minutes

    const keyboard = await AppController().getKeyboardOfDatabases(databases.results, "❌ Don't upload image", "image", ctx.session.imagesForAdd)

    ctx.reply(`Select the <strong>database</strong> to save this image\n\nIf you atached an caption to this image, <strong>it's gonna be the title of the new page</strong> in the Database\n\n<strong>Remember that this image keeps public</strong>\nDon't upload sensitive data!`, {...keyboard, parse_mode: "HTML"})
}

module.exports = onPhoto