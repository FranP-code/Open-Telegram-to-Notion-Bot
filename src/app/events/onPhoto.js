const AppController = require('../../controller/AppController.js');
const reply = require('../../scripts/reply.js');

async function onPhoto(ctx) {
    const data = await ctx.getFile()

    const databases = await AppController.notion.getDatabases(ctx?.from?.id)

    if (databases.status === "error") {
        switch (databases.message) {
            case "no auth code":
                reply(ctx, 'No auth code provided\n*Use the /auth command for provide it*', {parse_mode: "MarkdownV2"})
                break;

            default:
                reply(ctx, 'Unknow error\n*Try again later*', {parse_mode: "MarkdownV2"})
                break;
        }

        return
    }

    //If the message have a caption, set it as title propierty
    if (ctx.update.message.caption) {
        data.title = ctx.update.message.caption
    }

    //Add image to array of texts
    const obj = {type: "image", data}
    ctx.session.dataForAdd.push(obj)

    const keyboard = await AppController.generateKeyboard.databases(databases.results, "❌ Don't upload image", "image", ctx.session.dataForAdd)

    reply(ctx, `Select the <strong>database</strong> to save this image\n\nIf you atached an caption to this image, <strong>it's gonna be the title of the new page</strong> in the Database\n\n<strong>Remember that this image keeps public</strong>\nDon't upload sensitive data!`, {...keyboard, parse_mode: "HTML"})
}

module.exports = onPhoto