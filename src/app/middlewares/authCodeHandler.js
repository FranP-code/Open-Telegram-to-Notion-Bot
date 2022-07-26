const DatabaseQuerys = require("../../controller/DatabaseQuerys")
const reply = require("../../scripts/reply")

async function authCodeHandler(ctx, next) {
    if (ctx.session.waitingForAuthCode) {

        ctx.session.waitingForAuthCode = false

        const response = await DatabaseQuerys().uploadApiKey(ctx.from.id, ctx.message.text)

        let message

        if (response.status === "error" && response.message === "Auth key not valid") {
            message = "Auth code not valid, type /auth again"
            return
        }
        
        if (response.status === "success"){
            message = "Auth code registered 👍\n\nSend a message to *add it to the database you select*", {parse_mode: "MarkdownV2"}
            return
        }

        if (response.status === "error") {
            message = "Unknow error, please try again later"
            return
        }

        reply(ctx, message)

    } else {
        await next()
    }
}

module.exports = authCodeHandler