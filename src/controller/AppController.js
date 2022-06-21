const DatabaseQuerys = require("./DatabaseQuerys")
const NotionQuerys = require("./NotionQuerys")

const extractSubstring = require('../scripts/extractSubstring')

const AppController = {

    t_response(ctx) {
        async function propierties(userID, callback_query) {

            //Get data index
            const index = parseInt(extractSubstring(callback_query ? callback_query : ctx.update.callback_query.data, "in_", false))

            //Config initialization
            let config
    
            if (callback_query) {
                config = callback_query
            } else {
                config = ctx.update.callback_query.data
            }

            ctx.session.dataForAdd[index].listOfPropiertiesQuery = config
    
            //In case that the cancel button is pressed
            if (config.includes("co_")) {

                //Get index
                const index = parseInt(extractSubstring(config, "in_", false))

                //Make value null
                ctx.session.dataForAdd[index] = null
    
                //Reply
                ctx.reply(`Operation canceled 👍`, {parse_mode: "HTML"})
                return
            }
    
            //Get database id
            const databaseID = extractSubstring(config, "db_", "dt_")
    
            //If not are saved, get propierties of database
            let properties
    
            if (!ctx.session.dataForAdd[index].propierties) {
    
                propierties = await AppController.notion.getPropierties(userID, databaseID)

                //Save propierties in data session
                ctx.session.dataForAdd[index].propierties = propierties

                //Save databaseID
                ctx.session.dataForAdd[index].databaseID = databaseID
            } else {
                propierties = ctx.session.dataForAdd[index].propierties
            }
    
            //Reply with propierties of the database
            const keyboard = await AppController.generateKeyboard.propierties(Object.values(propierties), index)
            await ctx.reply("Select the <strong>propierties</strong> for define", {parse_mode: "HTML", ...keyboard})
        }

        async function values() {
            //Get propierty ID
            const propID = extractSubstring(ctx.update.callback_query.data, "pr_", "in_")
            //Get data index
            const index = parseInt(extractSubstring(ctx.update.callback_query.data, "in_", ""))

            //Get data
            const data = ctx.session.dataForAdd[index]

            //Save this callbackQuery
            ctx.session.dataForAdd[index].propiertiesQuery = ctx.update.callback_query.data

            //Get the propierty with the selected ID
            const propierty = Object.values(data.propierties).find(obj => {
                return obj.id === propID
            })

            /**
             * * pi_ = propietary_index
             * * pr_ = propierty_id
             * * dn_ = done
            */
            
            switch (propierty.type) {
                case "multi_select":
                    await ctx.reply(`Select the options for add to <strong>${propierty.name}</strong>`, {parse_mode: "HTML", reply_markup: {
                        inline_keyboard: [
                            ...propierty.multi_select.options.map(option => {
                                return [{
                                    text: option.name,
                                    callback_data: "vl_" + option.id + "pr_" + propierty.id + "pi_" + index
                                }]
                            }),
                            [{
                                text: "✅",
                                callback_data: "vl_" + "dn_" + "pi_" + index
                            }]
                        ]
                    }})
                    break;
    
                case "phone_number":
                    ctx.session.waitingForPropiertyValue = {...propierty, index}
                    await ctx.reply(`Write the value for <strong>${propierty.name}</strong>`, {parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "🚫",
                                    callback_data: "vl_" + "dn_" + "pi_" + index
                                }]
                            ]
                    }})
                    break; 
                case "number":
                    ctx.session.waitingForPropiertyValue = {...propierty, index}
                    await ctx.reply(`Type the number for <strong>${propierty.name}</strong>`, {parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "🚫",
                                    callback_data: "vl_" + "dn_" + "pi_" + index
                                }]
                            ]
                        }
                    })
                    break; 
                case "checkbox":
                    await ctx.reply(`Select if the checkbox <strong>${propierty.name}</strong> stays checked or not`, {parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "Checked",
                                    callback_data: "vl_" + true + "pr_" + propierty.id + "pi_" + index
                                }],
                                [{
                                    text: "Unchecked",
                                    callback_data: "vl_" + false + "pr_" + propierty.id + "pi_" + index
                                }],
                                [{
                                    text: "🚫",
                                    callback_data: "vl_" + "dn_" + "pi_" + index
                                }]
                            ]
                        }
                    })
                    break;
                case "select":
                    await ctx.reply(`Select the value for <strong>${propierty.name}</strong> propierty`, {parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                ...propierty.select.options.map(option => {
                                    return [{
                                        text: option.name,
                                        callback_data: "vl_" + option.id + "pr_" + propierty.id + "pi_" + index
                                    }]
                                }),
                                [{
                                    text: "🚫",
                                    callback_data: "vl_" + "dn_" + "pi_" + index
                                }]
                            ]
                        }
                    })
                    break; 
                case "email":
                    ctx.session.waitingForPropiertyValue = {...propierty, index}
                    await ctx.reply(`Type the email for <strong>${propierty.name}</strong>`, {parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "🚫",
                                    callback_data: "vl_" + "dn_" + "pi_" + index
                                }]
                            ]
                        }
                    })
                    break; 
                case "rich_text":
                    ctx.session.waitingForPropiertyValue = {...propierty, index}
                    await ctx.reply(`Type the text for <strong>${propierty.name} propierty</strong>`, {parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "🚫",
                                    callback_data: "vl_" + "dn_" + "pi_" + index
                                }]
                            ]
                        }
                    })
                    break;
                case "url":
                    ctx.session.waitingForPropiertyValue = {...propierty, index}
                    await ctx.reply(`Type the URL for <strong>${propierty.name}</strong> propierty`, {parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "🚫",
                                    callback_data: "vl_" + "dn_" + "pi_" + index
                                }]
                            ]
                        }
                    })
                    break;
                case "title":
                    ctx.session.waitingForPropiertyValue = {...propierty, index}
                    await ctx.reply(`Type the <strong>new title</strong>`, {parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "🚫",
                                    callback_data: "vl_" + "dn_" + "pi_" + index
                                }]
                            ]
                        }
                    })
                    break; 
                case "files":
                    ctx.session.waitingForPropiertyValue = {...propierty, index}
                    await ctx.reply(`Place the URL for <strong>${propierty.name}</strong>`, {parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "🚫",
                                    callback_data: "vl_" + "dn_" + "pi_" + index
                                }]
                            ]
                        }
                    })
                    break;
                
                case "date": 
                    ctx.session.waitingForPropiertyValue = {...propierty, index}
                    await ctx.reply(`Type the <strong>${propierty.name}</strong> preferably with one of the following structures:\n\n- <strong>12/25/2022</strong>\n- <strong>12/25/2022 15:00</strong>\n- <strong>12-25-2022 15:00</strong>\n- <strong>2022-05-25T11:00:00</strong>`, {parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "🚫",
                                    callback_data: "vl_" + "dn_" + "pi_" + index
                                }]
                            ]
                        }
                    })
                default:
                    return {response: "error"}
                    break;
            }
        }

        return {
            propierties,
            values
        }
    },

    generateKeyboard: {
        databases(databases, cancelOperationText, dataType, sessionStorage) {

            /**
             * * db_ = database_prefix
             * * dt_ = dataType
             * * in_ = indexOnSession
             * * co_ = cancel_operation
             * 
             * Thank you Telegram and your's 64 bit limit https://github.com/yagop/node-telegram-bot-api/issues/706
             */
            return {
                reply_markup: {
                    inline_keyboard: [
                        ...databases.map((obj) => {
                                const title = obj.title.length <= 0 ?  "Untitled" : obj.title[0].text.content
        
                                if (obj.properties.telegramIgnore) {
                                    return []
                                }
        
                                if (obj.icon) {
                                    return [{
                                        text: `${obj.icon.emoji ? obj.icon.emoji + " " : ""}${title}`,
                                        callback_data: "db_" + obj.id + "dt_" + dataType + "in_" + JSON.stringify(sessionStorage.length - 1)
                                    }]
                                } else {
                                    return [{
                                        text: title,
                                        callback_data: "db_" + obj.id + "dt_" + dataType + "in_" + JSON.stringify(sessionStorage.length - 1)
                                    }]
                                }
                            }),
                            [
                                {
                                    text: !cancelOperationText ? "🚫" : cancelOperationText,
                                    callback_data: "db_" + "co_" + "dt_" + dataType + `in_` + JSON.stringify(sessionStorage.length - 1)
                                }
                            ]
                    ]
                }
            }
        },

        propierties(propierties, dataIndex) {
            /**
             * * pr_ = propierty prefix
             * * in_ = data index
             * * sd_ = send
             * * co_ = cancel operation
            */
    
            //Filter the propierties for only keep the valid ones
            const validTypes = ["multi_select", "phone_number", "number", "checkbox", "select", "email", "rich_text", "url", "title", "files", "date"]
    
            propierties = propierties.filter(prop => {
                if (validTypes.includes(prop.type)) {
                    return prop
                }
            })
    
            return {
                reply_markup: {
                    inline_keyboard: [
                        ...propierties.map((prop) => {
                                return [{
                                    text: prop.name,
                                    callback_data: "pr_" + prop.id + "in_" + dataIndex
                                }]
                            }),
                            [
                                {
                                    text: "✅",
                                    callback_data: "pr_" + "sd_" + "in_" + dataIndex
                                }
                            ],
                            [
                                {
                                    text: "🚫",
                                    callback_data: "pr_" + "co_" + "in_" + dataIndex
                                }
                            ]
                    ]
                }
            }
        }
    },

    notion: {
        async getDatabases(userID) {
            const userRegistered = await DatabaseQuerys().checkUserRegistered(userID)
    
            if (userRegistered.status === "error") {
                return {
                    status: "error",
                    message: "no auth code"
                }
            }
    
            const notionAuthKey = await DatabaseQuerys().getNotionAuthKey(userID)
            return await NotionQuerys(notionAuthKey.data).returnAllDatabases()
        },
    
        async addMessageToDatabase(userID, databaseId, data) {
            const notionAuthKey = await DatabaseQuerys().getNotionAuthKey(userID)
        
            console.log(data)
            const response = await NotionQuerys(notionAuthKey.data).addBlockToDatabase(databaseId, data.data.title, data.propiertiesValues)
            const databaseData = await NotionQuerys(notionAuthKey.data).getDatabaseData(databaseId)
    
            response.databaseTitle = databaseData.title.length <= 0 ?  "Untitled" : databaseData.title[0].text.content
            return response
        },
    
        async addImageToDatabase(userID, databaseID, imageURL, title, propierties) {
    
            try {
                const uploadResponse = await DatabaseQuerys().uploadAndGetImageURL(imageURL)
    
                if (uploadResponse.status === "error") {
                    return {status: "error", message: 'There has been an error uploading the image, please try again later'}
                }
    
                const notionAuthKey = await DatabaseQuerys().getNotionAuthKey(userID)
    
                const response = await NotionQuerys(notionAuthKey.data)
                    .createPageWithBlock(databaseID, {
                        blockType: "image",
                        imageURL: uploadResponse.data.url,
                        title: title,
                        propierties: propierties
                    })
                console.log(response)
    
                return {status: "success", databaseTitle: response.databaseData.title.length <= 0 ?  "Untitled" : response.databaseData.title[0].text.content}
            } catch (err) {
                console.log(err)       
                return {status: "error"}
            }
        },
    
        async getPropierties(userID, databaseID) {
            try {
                const notionAuthKey = await DatabaseQuerys().getNotionAuthKey(userID)
                
                const response = await NotionQuerys(notionAuthKey.data).getDatabaseData(databaseID)
                return response.properties
            } catch (err) {
                console.log(err)
                return {status: "error"}
            }
        }
    }
}

module.exports = AppController