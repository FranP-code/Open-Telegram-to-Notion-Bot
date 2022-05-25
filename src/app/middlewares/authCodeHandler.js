const DatabaseQuerys = require("../../controller/DatabaseQuerys")

async function authCodeHandler(ctx, next) {
    if (ctx.session.waitingForAuthCode) {

        ctx.session.waitingForAuthCode = false

        const response = await DatabaseQuerys().uploadApiKey(ctx.from.id, ctx.message.text)

        if (response.status === "error" && response.message === "Auth key not valid") {
            ctx.reply("Auth code not valid, type /auth again")
            return
        }
        
        if (response.status === "success"){
            ctx.reply("Auth code registered 👍\n\nSend a message to *add it to the database you select*", {parse_mode: "MarkdownV2"})
            return
        }

        if (response.status === "error") {
            ctx.reply("'Unknow error, please try again later'")
            return
        }

    } else {
        await next()
    }
}

module.exports = authCodeHandler