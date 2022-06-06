const moment = require("moment")

const AppController = require('../../controller/AppController')
const deleteMessage = require("../../scripts/deleteMessage")


async function onText(ctx) {

    if (ctx.session.waitingForPropiertyValue) {
        
        const index = ctx.session.waitingForPropiertyValue.propiertyIndex
        const propiertyID = ctx.session.waitingForPropiertyValue.id

        let userInput = ctx.message.text.trim()
        
        //If not exists the propierties values propierty, create it
        if (!ctx.session.dataForAdd[index].propiertiesValues) {
            ctx.session.dataForAdd[index].propiertiesValues = {}
        }

        const propierty = Object.values(ctx.session.dataForAdd[index].propierties).find(prop => {
            return prop.id === propiertyID
        })

        const urlReg = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            //Credits: https://stackoverflow.com/a/5717133/18740899
        
        //Check if the value is valid
        switch (propierty.type) {
            
            case "files":
                if (!urlReg.test(userInput)) {
                    await ctx.reply("This don't look like a URL")
                    return
                }
                break;

            case "number":
                if (isNaN(parseInt(userInput))) {
                    await ctx.reply("That's not a number")
                    return
                }
                break;

            case "url":
                if (!urlReg.test(userInput)) {
                    await ctx.reply("This don't look like a URL")
                    return
                }
                break;

            case "date":
                userInput = moment(userInput).format().toString()

                if (!moment(userInput).isValid()) {
                    await ctx.reply("This don't look like a date")
                    return
                }
                break;
                
            default:
                break;
        }

        //Parse text
        switch (propierty.type) {

            case "files":
                userInput = [
                    {
                        "type": "external",
                        "name": userInput,
                        "external": {
                            "url": userInput
                        }
                    }
                ]
                break;
            case "number":
                userInput = parseInt(userInput)
                break;

            case "rich_text":
                userInput = [{type: "text", text: {content: userInput}}]
                break;

            case "title":
                ctx.session.dataForAdd[index].data.title = userInput
                userInput = [{text: {content: userInput}}]
                break;

            case "date":
                userInput = {start: userInput}
                break;
            default:
                break;
        }

        //Save value on storage
        ctx.session.dataForAdd[index].propiertiesValues[propiertyID] = userInput
        
        //Confirm to user the saved prop
        await ctx.reply(`Data added to ${propierty.name}`)
        await deleteMessage(ctx, ctx.update.message.message_id - 1)

        //Return the list of propierties to user
        AppController().t_responses(ctx).respondWithOfPropierties(ctx.from.id, ctx.session.dataForAdd[index].listOfPropiertiesQuery)
        
        //App not longer waits for propierty value...
        ctx.session.waitingForPropiertyValue = false

        return
    }

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
    const obj = {type: "text", data: {title: text}}
    ctx.session.dataForAdd.push(obj)

    //If pass some time delete the text on the array
    function cleanArray() {
        if (ctx.session.dataForAdd.includes(obj)) {
            const index = ctx.session.dataForAdd.indexOf(obj)
            ctx.session.dataForAdd.splice(index, 1)
        }
    }

    //Delete the item in the dataForAdd in...
    setTimeout(cleanArray, 15 * 60 * 1000) //15 Minutes

    const botReply = text.length > 20 ? "\n\n" + text : text

    //Generate Keyboard from the databases
    const keyboard = await AppController().getKeyboardOfDatabases(databases.results, null, "text", ctx.session.dataForAdd)

    ctx.reply(`Select the <strong>database</strong> to save <strong>${botReply}</strong>`, {...keyboard, parse_mode: "HTML"})
}

module.exports = onText