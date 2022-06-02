const AppController = require("../../controller/AppController")
const DatabaseQuerys = require("../../controller/DatabaseQuerys")

async function onCallbackQuery(ctx) {

    //In case that the cancel button is pressed
    if (ctx.update.callback_query.data.includes("co_")) {

        //Get dataType
        const dataType = extractSubstring(ctx.update.callback_query.data, "dt_", "i_")
        
        switch (dataType) {
            case "text":
                //Get text position
                const textIndex = parseInt(extractSubstring(ctx.update.callback_query.data, "i_", ""))
                //Make it null
                ctx.session.textsForAdd[textIndex] = null
                break;
            
            case "image":
                //Get image position
                const position = parseInt(extractSubstring(ctx.update.callback_query.data, "i_", ""))
                //Make it null
                ctx.session.imagesForAdd[position] = null
        
            default:
                break;
            }
        deleteMessage(ctx, ctx.update.callback_query.message.message_id)
        ctx.reply(`Operation canceled 👍`, {parse_mode: "HTML"})
        return
    }

    //Get database id
    const databaseID = extractSubstring(ctx.update.callback_query.data, "db_", "dt_")

    //Get dataType
    const dataType = extractSubstring(ctx.update.callback_query.data, "dt_", "i_")

    let response

    switch (dataType) {
        case "text":
            //Get what text want the user add
            const textIndex = parseInt(extractSubstring(ctx.update.callback_query.data, "i_", ""))
            const text = ctx.session.textsForAdd[textIndex]

            response = await AppController().addMessageToNotionDatabase(ctx.from.id, databaseID, text)
        
            ctx.reply(`<strong>${text.length > 20 ? text + "\n\n</strong>" : text + "</strong> "}added to <strong>${response.databaseTitle}</strong> database 👍`, {parse_mode: "HTML"})
        
            // Change this text on array for null
            ctx.session.textsForAdd[textIndex] = null
            break;

        case "image":
            //Get what image want the user add
            const index = parseInt(extractSubstring(ctx.update.callback_query.data, "i_", ""))
            const image = ctx.session.imagesForAdd[index]
            const imageTitle = image.title ? image.title : image.file_path

            response = await AppController().addImageToDatabase(ctx.from.id, databaseID, `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${image.file_path}`, imageTitle)

            ctx.reply(`<strong>${imageTitle.length > 20 ? imageTitle + "\n\n</strong>" : imageTitle + "</strong> "}added to <strong>${response.databaseTitle}</strong> database 👍`, {parse_mode: "HTML"})

            // Change this image on array for null
            ctx.session.imagesForAdd[index] = null
            break;
    
        default:
            reportError(ctx)
            break;
    }

    //Report in error case
    if (response.status === "error") {
        deleteMessage(ctx, ctx.update.callback_query.message.message_id)
        reportError(ctx)
        return
    }

    //Delete DB selector
    deleteMessage(ctx, ctx.update.callback_query.message.message_id)
}

//Extract substring function
function extractSubstring(str, start, end) {

    const position = str.indexOf(start) + start.length;

    if (!end) {
        return str.substring(position, str.length)
    }
    return str.substring(position, str.indexOf(end, position));
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