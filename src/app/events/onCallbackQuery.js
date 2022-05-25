const AppController = require("../../controller/AppController")

async function onCallbackQuery(ctx) {
    //In case that the cancel button is pressed
    if (ctx.update.callback_query.data === "cancel_operation") {
        deleteMessage(ctx, ctx.update.callback_query.message.message_id)
        ctx.reply(`Operation canceled 👍`, {parse_mode: "HTML"})
        return
    }

    //Get database id
    const databaseID = extractSubstring(ctx.update.callback_query.data, "database_id", "text_index")

    //Get what text want the user add
    const textIndex = parseInt(extractSubstring(ctx.update.callback_query.data, "text_index", ""))
    const text = ctx.session.textsForAdd[textIndex]

    // Check if databaseID and text are defined
    if (!databaseID || !text) {
        reportError(ctx)
        return
    }

    const response = await AppController().addMessageToNotionDatabase(ctx.from.id, databaseID, text)

    if (response.status === "error") {
        deleteMessage(ctx, ctx.update.callback_query.message.message_id)
        reportError(ctx)
        return
    }

    ctx.reply(`<strong>${text.length > 20 ? text + "\n\n</strong>" : text + "</strong> "}added to <strong>${response.databaseTitle}</strong> database 👍`, {parse_mode: "HTML"})
    deleteMessage(ctx, ctx.update.callback_query.message.message_id)

    // Change this text on array for null
    ctx.session.textsForAdd[textIndex] = null

    // If all texts on the array are null, clean the array
    let allTextsAreNull = true

    ctx.session.textsForAdd.forEach(text => {
        if (text !== null) {
            allTextsAreNull = false
        }
    })

    if (allTextsAreNull) {
        ctx.session.textsForAdd = []
    }
}

//Extract substring function
function extractSubstring(str, a, b) {

    const position = str.indexOf(a) + a.length;

    if (!b) {
        return str.substring(position, str.length)
    }
    return str.substring(position, str.indexOf(b, position));
}

// Delete message function
async function deleteMessage(ctx, messageId) {
    try {
        await ctx.api.deleteMessage(ctx.chat.id, messageId)
    } catch (error) {
        console.log(error)
    }
}

// Error message function
function reportError(ctx) {
    ctx.reply("Has been an error. Try again later")
}

module.exports = onCallbackQuery