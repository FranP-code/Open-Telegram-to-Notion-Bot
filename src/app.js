const { Bot, session } = require('grammy');
const DatabaseQuerys = require('./controller/DatabaseQuerys');
const AppController = require('./controller/AppController')
require('dotenv').config()

const bot = new Bot(process.env.BOT_TOKEN)

// Setting default session for user
function initialSesionValues() {
    return {waitingForAuthCode: false};
}

bot.use(session({ initial: initialSesionValues }));

// Set a middleware for reject other users when the bot is on development
bot.use(async (ctx, next) => {
    
    if (process.env.NODE_ENV !== "development") {
        return
    }

    if (ctx.from.id !== parseInt(process.env.MY_USER_ID)) {
        ctx.reply('⚠️ Sorry, this bot is on development for now... \nStay alert for new updates! \nrepo: https://github.com/FranP-code/Telegram-to-Notion-Bot')
        return
    }

    await next()
})

//Set a middleware for check if the bot is waiting the auth code
bot.use(async (ctx, next) => {
    if (ctx.session.waitingForAuthCode) {

        ctx.reply("Loading")
                
        ctx.session.waitingForAuthCode = false

        const response = await DatabaseQuerys().uploadApiKey(ctx.from.id, ctx.message.text)

        if (response.status === "error" && response.message === "Auth key not valid") {
            editMessage(ctx, ctx.update.message.message_id + 1, "Auth code not valid, type /auth again")
            return
        }
        
        if (response.status === "success"){
            editMessage(ctx, ctx.update.message.message_id + 1, "Auth code registered 👍\n\nSend a message to *add it to the database you select*")
            return
        }

        if (response.status === "error") {
            editMessage(ctx, ctx.update.message.message_id + 1, 'Unknow error, please try again later')
            return
        }

    } else {
        await next()
    }
})

//Welcome message
bot.command('start', ctx => {
    ctx.reply(`Welcome to the *Telegram to Notion Bot*\n\nWith this bot you can send any text message and add it to one database on Notion\n\nType /auth for authorize the bot`, {parse_mode: "MarkdownV2"})
})

// Auth message sending
bot.command('auth', ctx => {
    ctx.session.waitingForAuthCode = true
    
    ctx.reply(`Tap here 👇 for authorize the bot on Notion and paste the resulting code`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Authorize",
                        url: `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${process.env.NOTION_INTEGRATION_ID}&redirect_uri=https://telegram-to-notion.herokuapp.com/auth&response_type=code`
                    }
                ]
            ]
        }
    })
})

// On the message sending, exec the main function of the bot
bot.on(':text', async ctx => {

    ctx.reply("*Wait a moment*", {parse_mode: "MarkdownV2"})

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

    ctx.session.textForAdd = ctx.message.text

    setTimeout(() => {
        deleteMessage(ctx, ctx.update.message.message_id + 1)
    }, 500)

    ctx.reply("Select the database to *save this text*", {
        reply_markup: {
            inline_keyboard: response.results.map((obj) => {

                if (obj.properties.telegramIgnore) {
                    return []
                }

                return [{
                    text: `${obj.icon.emoji ? obj.icon.emoji + " " : ""}${obj.title[0].text.content}`,
                    callback_data: "database_id" + obj.id
                }]
            })
        },
        parse_mode: "MarkdownV2"
    })
})

//Handle the text sended for the user
bot.on("callback_query:data", async ctx => {

    editMessage(ctx, ctx.update.callback_query.message.message_id, "*Wait a moment*")
    
    let id = ctx.update.callback_query.data

    // Check if the data includes the prefix indicated
    if (!id.includes("database_id")) {
        return
    }

    // Delete the prefix
    id = id.split('database_id')[1]
    
    // Almacenate the text to add
    const text = ctx.session.textForAdd

    // Clean the state of the text
    ctx.session.textForAdd = false

    const response = await AppController().addMessageToNotionDatabase(ctx.from.id, id, text)

    if (response.status === "error") {
        deleteMessage(ctx, ctx.update.callback_query.message.message_id)
        ctx.reply("Has been an error. Try again later")
        return
    }

    editMessage(ctx, ctx.update.callback_query.message.message_id, "✅ *Done*")
    ctx.reply(`*${text}* added to *${response.databaseTitle}* database 👍`, {parse_mode: "MarkdownV2"})
})

// Delete message function
async function deleteMessage(ctx, messageId) {
    await ctx.api.deleteMessage(ctx.chat.id, messageId)
}

async function editMessage(ctx, messageId, newText) {
    await ctx.api.editMessageText(ctx.chat.id, messageId, newText, {parse_mode: "MarkdownV2"})
}

bot.on(':sticker', ctx => {
    ctx.reply('❤️')
})

bot.on(':photo', ctx => {
    ctx.reply("<strong>Pictures are not allowed...</strong>", {parse_mode: "HTML"})
    
    setTimeout(() => {
        ctx.reply("<strong>...yet</strong>", {parse_mode: "HTML"})
    }, 3500)
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.start()

// Fuck Telegraf
// My hommies and I hate Telegraf
// Grammy for the win