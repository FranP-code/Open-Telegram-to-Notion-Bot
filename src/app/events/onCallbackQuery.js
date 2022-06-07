const AppController = require("../../controller/AppController")

const extractSubstring = require("../../scripts/extractSubstring")
const deleteMessage = require("../../scripts/deleteMessage")

async function onCallbackQuery(ctx) {

    const userID = ctx.from.id

    const prefix = ctx.update.callback_query.data.substring(0, 3)
    /**
     * * "db_" = database selection
     * * "pr_" = propierty selection
     * * "vl_" = value selection
    */

    switch (prefix) {
        case "db_": {
            try {
                const response = await AppController().t_responses(ctx).respondWithOfPropierties(userID)

                if (response.status === "error") {
                    reportError(ctx, false, response.message)
                }
                
                //Delete the previous message
                deleteMessage(ctx, ctx.update.callback_query.message.message_id)
            } catch (err) {
                console.log(err)
                reportError(ctx, err)
            }

            break;
        }
        
        case "pr_": {
            try {
                //Check if cancel operation button is pressed
                if (extractSubstring(ctx.update.callback_query.data, "pr_", "in_") === "co_") {
                    ctx.reply("Operation canceled", {parse_mode: "HTML"})
                    //Delete the previous message
                    deleteMessage(ctx, ctx.update.callback_query.message.message_id)
                    return
                }

                //Check if send button is pressed
                if (extractSubstring(ctx.update.callback_query.data, "pr_", "in_") === "sd_") {

                    //Get data
                    const index = extractSubstring(ctx.update.callback_query.data, "in_", false)
                    const data = ctx.session.dataForAdd[index]
                    
                    let response
                    
                    switch (data.type) {
                        case "text": {
                            //Get what text want the user add
                            const text = data.data.title
                            
                            response = await AppController().addMessageToNotionDatabase(userID, data.databaseID, data)
                            
                            if (response.status !== "error") {
                                ctx.reply(`<strong>${text.length > 20 ? text + "\n\n</strong>" : text + "</strong> "}added to <strong>${response.databaseTitle}</strong> database 👍`, {parse_mode: "HTML"})
                            }

                            break;
                        }

                        case "image":
                            //Get what image want the user add
                            const image = data.data
                            image.title = image.title ? image.title : image.file_path

                            response = await AppController().addImageToDatabase(userID, data.databaseID, `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${image.file_path}`, image.title, data.propiertiesValues)

                            if (response.status !== "error") {
                                ctx.reply(`<strong>${image.title.length > 20 ? image.title + "\n\n</strong>" : image.title + "</strong> "}added to <strong>${response.databaseTitle}</strong> database 👍`, {parse_mode: "HTML"})
                            }
                                
                            break;
                    
                        default:
                            reportError(ctx)
                            break;
                    }

                    // Change this data on array for null
                    ctx.session.dataForAdd[index] = null

                    //Report in error case
                    if (response.status === "error") {
                        deleteMessage(ctx, ctx.update.callback_query.message.message_id)
                        reportError(ctx)
                        return
                    }

                    //Delete DB selector
                    deleteMessage(ctx, ctx.update.callback_query.message.message_id)

                    return
                }

                try {
                    const response = await AppController().t_responses(ctx).respondWithPropiertyValues()

                    if (response.status === "error") {
                        reportError(ctx, false, response.message)
                    }
                } catch (err) {
                    console.log(err)
                    reportError(ctx, err)
                }


                //Delete the previous message
                deleteMessage(ctx, ctx.update.callback_query.message.message_id)
            } catch (err) {
                console.log(err)
                reportError(ctx, err)       
            }

            break;
        }

        case "vl_": {

            try {
                //Get data index
                const index = parseInt(extractSubstring(ctx.update.callback_query.data, "pi_", ""))
    
                //If done or cancel operation button pressed
                if (extractSubstring(ctx.update.callback_query.data, "vl_", "pi_") === "dn_") {

                    //Set false in the case that the app was waiting for a value
                    ctx.session.waitingForPropiertyValue = false

                    //Delete the previous message
                    await deleteMessage(ctx, ctx.update.callback_query.message.message_id)

                    try {
                        const response = await AppController().t_responses(ctx).respondWithOfPropierties(userID, ctx.session.dataForAdd[index].listOfPropiertiesQuery)
                        
                        if (response.status === "error") {
                            reportError(ctx, false, response.message)
                        }

                    } catch (err) {
                        console.log(err)
                        reportError(ctx, err)                        
                    }
                    return
                }

                //Get propierty id
                const propiertyID = extractSubstring(ctx.update.callback_query.data, "pr_", "pi_")

                //Get propierty data
                const propierty = Object.values(ctx.session.dataForAdd[index].propierties).find(prop => {
                    return prop.id === propiertyID
                })

                //Get optionID
                const optionID = extractSubstring(ctx.update.callback_query.data, "vl_", "pr_")

                //If not exists the propierties values propierty, create it
                if (!ctx.session.dataForAdd[index].propiertiesValues) {
                    ctx.session.dataForAdd[index].propiertiesValues = {}
                }

                const propiertyValue = ctx.session.dataForAdd[index].propiertiesValues[propiertyID]

                switch (propierty.type) {
                    case "multi_select": {
                        //Get data
                        const data = propierty.multi_select.options.find(option => {
                            return option.id === optionID
                        })

                        if (propiertyValue) {
                            // If the array don't include the propierty id, add it
                            if (!Object.keys(ctx.session.dataForAdd[index].propiertiesValues[propiertyID]).includes(data)) {
                                ctx.session.dataForAdd[index].propiertiesValues[propiertyID] = [...propiertyValue, data]
                            }
                        } else {
                            ctx.session.dataForAdd[index].propiertiesValues[propiertyID] = [data]
                        }

                        ctx.reply(`<strong>${data.name}</strong> value added`, {parse_mode: "HTML"})
                        
                        break;
                    }
    
                    case "checkbox": {
                        // Get the boolean of the optionID
                        const p_data = JSON.parse(optionID)
                        
                        //Add it to the values
                        ctx.session.dataForAdd[index].propiertiesValues[propiertyID] = p_data
                        
                        //Reply
                        await ctx.reply(`<strong>${propierty.name}</strong> is <strong>${p_data ? "checked" : "unchecked"}</strong>`, {parse_mode: "HTML"})

                        //Delete the checked selector
                        await deleteMessage(ctx, ctx.update.callback_query.message.message_id)

                        //Reply with propierties list

                        try {
                            const response = AppController().t_responses(ctx).respondWithOfPropierties(userID, ctx.session.dataForAdd[index].listOfPropiertiesQuery)

                            if (response.status === "error") {
                                reportError(ctx, false, response.message)
                            }

                        } catch (err) {
                            console.log(err)
                            reportError(ctx, err)
                        }
                    
                        break; 
                    }

                    case "select": { 
                        //Get data
                        const data = propierty.select.options.find(option => {
                            return option.id === optionID
                        })
    
                        ctx.session.dataForAdd[index].propiertiesValues[propiertyID] = data

                        //Reply
                        await ctx.reply(`<strong>${data.name}</strong> value added`, {parse_mode: "HTML"})

                        //Delete the checked selector
                        await deleteMessage(ctx, ctx.update.callback_query.message.message_id)

                        //Reply with propierties list
                        try {
                            
                            const response = await AppController().t_responses(ctx).respondWithOfPropierties(userID, ctx.session.dataForAdd[index].listOfPropiertiesQuery)
                        
                            if (response.status === "error") {
                                reportError(ctx, false, response.message)
                            }
                        } catch (err) {
                            console.log(err)
                            reportError(ctx, err)
                        }
                        break;
                
                    }

                    default:
                        reportError(ctx)
                        break;
                }

            } catch (error) {
                console.log(err)
                reportError(ctx, err)
            }

            break;
        }
    }    
}

// Error message function
function reportError(ctx, err, message) {
    ctx.reply(message ? `Has been an error.\n\n${message}`: "Has been an error. Try again later" )
    
    if (err) {
        ctx.api.sendMessage(process.env.MY_USER_ID, err)
    }
}

module.exports = onCallbackQuery