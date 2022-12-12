const DatabaseQuerys = require("./DatabaseQuerys")
const NotionQuerys = require("./NotionQuerys")

const extractSubstring = require('../scripts/extractSubstring')
const reportError = require("../scripts/reportError")
const reply = require("../scripts/reply")

const AppController = {

    t_response(ctx) {
        async function properties(userID, callback_query) {
					const index = parseInt(
						extractSubstring(
							callback_query ? callback_query : ctx.update.callback_query.data,
							"in_",
							false
						)
					);

					if (!ctx.session.dataForAdd[index]) {
						reportError(ctx);
						return;
					}

					//Config initialization
					let config;

					if (callback_query) {
						config = callback_query;
					} else {
						config = ctx.update.callback_query.data;
					}

					ctx.session.dataForAdd[index].listOfpropertiesQuery = config;

					//In case that the cancel button is pressed
					if (config.includes("co_")) {
						//Make value null
						ctx.session.dataForAdd[index] = null;

						//Reply
						reply(ctx, `Operation canceled 👍`, { parse_mode: "HTML" });
						return;
					}

					//Get database id
					const databaseID = extractSubstring(config, "db_", "dt_");

					//If not are saved, get properties of database
					let properties;

					if (!ctx.session.dataForAdd[index].properties) {
						properties = await AppController.notion.getproperties(
							userID,
							databaseID
						);

						//Save properties in data session
						ctx.session.dataForAdd[index].properties = properties;

						//Save databaseID
						ctx.session.dataForAdd[index].databaseID = databaseID;
					} else {
						properties = ctx.session.dataForAdd[index].properties;
					}

					//Reply with properties of the database
					const keyboard = await AppController.generateKeyboard.properties(
						Object.values(properties),
						index
					);
					await reply(
						ctx,
						"Select the <strong>properties</strong> for define",
						{ parse_mode: "HTML", ...keyboard }
					);
				}

        async function values() {
            //Get propierty ID
            const propID = extractSubstring(ctx.update.callback_query.data, "pr_", "in_")
            //Get data index
            const index = parseInt(extractSubstring(ctx.update.callback_query.data, "in_", ""))
            //Get data
            const data = ctx.session.dataForAdd[index]

            if (!data) {
                reportError(ctx)
                return
            }

            //Save this callbackQuery
            ctx.session.dataForAdd[index].propertiesQuery = ctx.update.callback_query.data

            //Get the propierty with the selected ID
            const propierty = Object.values(data.properties).find(obj => {
                return obj.id === propID
            })

            /**
             * * pi_ = propietary_index
             * * pr_ = propierty_id
             * * dn_ = done
            */

            const message = {}

            if (propierty.type === "multi_select") {
                message.text = `Select the options for add to <strong>${propierty.name}</strong>`
                message.data = {parse_mode: "HTML", reply_markup: {
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
                }}
            }

            if (propierty.type === "phone_number") {
                ctx.session.waitingForPropiertyValue = {...propierty, index}
                message.text = `Write the value for <strong>${propierty.name}</strong>`
                message.data = {parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "🚫",
                                callback_data: "vl_" + "dn_" + "pi_" + index
                            }]
                        ]
                    }
                }
            }
            if (propierty.type === "number") {
                ctx.session.waitingForPropiertyValue = {...propierty, index}
                message.text = `Type the number for <strong>${propierty.name}</strong>`
                message.data =  {parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "🚫",
                                callback_data: "vl_" + "dn_" + "pi_" + index
                            }]
                        ]
                    }
                }
            }
            if (propierty.type === "checkbox") {
                message.text = `Select if the checkbox <strong>${propierty.name}</strong> stays checked or not`
                message.data = {parse_mode: "HTML",
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
                }
            }
            if (propierty.type === "select") {
                message.text = `Select the value for <strong>${propierty.name}</strong> propierty`
                message.data = {parse_mode: "HTML",
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
                }
            } 
            if (propierty.type === "email") {
                ctx.session.waitingForPropiertyValue = {...propierty, index}
                message.text = `Type the email for <strong>${propierty.name}</strong>`
                message.data = {parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "🚫",
                                callback_data: "vl_" + "dn_" + "pi_" + index
                            }]
                        ]
                    }
                }
            } 
            if (propierty.type === "rich_text") {
                ctx.session.waitingForPropiertyValue = {...propierty, index}
                message.text = `Type the text for <strong>${propierty.name} propierty</strong>`
                message.data = {parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "🚫",
                                callback_data: "vl_" + "dn_" + "pi_" + index
                            }]
                        ]
                    }
                }
            }
            if (propierty.type === "url") {
                ctx.session.waitingForPropiertyValue = {...propierty, index}
                message.text = `Type the URL for <strong>${propierty.name}</strong> propierty`
                message.data = {parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "🚫",
                                callback_data: "vl_" + "dn_" + "pi_" + index
                            }]
                        ]
                    }
                }
            }
            if (propierty.type === "title") {
                ctx.session.waitingForPropiertyValue = {...propierty, index}
                message.text = `Type the <strong>new title</strong>`
                message.data = {parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "🚫",
                                callback_data: "vl_" + "dn_" + "pi_" + index
                            }]
                        ]
                    }
                }
            } 
            if (propierty.type === "files") {
                ctx.session.waitingForPropiertyValue = {...propierty, index}
                message.text = `Place the URL for <strong>${propierty.name}</strong>`
                message.data = {parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "🚫",
                                callback_data: "vl_" + "dn_" + "pi_" + index
                            }]
                        ]
                    }
                }
            }
            if (propierty.type === "date") {
                ctx.session.waitingForPropiertyValue = {...propierty, index}
                message.text = `Type the <strong>${propierty.name}</strong> preferably with one of the following structures:\n\n- <strong>12/25/2022</strong>\n- <strong>12/25/2022 15:00</strong>\n- <strong>12-25-2022 15:00</strong>\n- <strong>2022-05-25T11:00:00</strong>`
                message.data = {parse_mode: "HTML",
                reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "🚫",
                                callback_data: "vl_" + "dn_" + "pi_" + index
                            }]
                        ]
                    }
                }
            }

            if (message.text) {
                reply(ctx, message.text, message.data)
            } else {
                return {response: "error"}
            }
        }

        return {
            properties,
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

        properties(properties, dataIndex) {
					/**
					 * * pr_ = propierty prefix
					 * * in_ = data index
					 * * sd_ = send
					 * * co_ = cancel operation
					 */

					//Filter the properties for only keep the valid ones
					const validTypes = [
						"multi_select",
						"phone_number",
						"number",
						"checkbox",
						"select",
						"email",
						"rich_text",
						"url",
						"title",
						"files",
						"date",
					];

					properties = properties.filter((prop) => {
						if (validTypes.includes(prop.type)) {
							return prop;
						}
					});

					return {
						reply_markup: {
							inline_keyboard: [
								...properties.map((prop) => {
									return [
										{
											text: prop.name,
											callback_data: "pr_" + prop.id + "in_" + dataIndex,
										},
									];
								}),
								[
									{
										text: "✅",
										callback_data: "pr_" + "sd_" + "in_" + dataIndex,
									},
								],
								[
									{
										text: "🚫",
										callback_data: "pr_" + "co_" + "in_" + dataIndex,
									},
								],
							],
						},
					};
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
            const response = await NotionQuerys(
							notionAuthKey.data
						).addBlockToDatabase(
							databaseId,
							data.data.title,
							data.propertiesValues
						);
            const databaseData = await NotionQuerys(notionAuthKey.data).getDatabaseData(databaseId)
    
            response.databaseTitle = databaseData.title.length <= 0 ?  "Untitled" : databaseData.title[0].text.content
            return response
        },
    
        async addImageToDatabase(userID, databaseID, imageURL, title, properties) {
    
            try {
                const uploadResponse = await DatabaseQuerys().uploadAndGetImageURL(imageURL)
    
                if (uploadResponse.status === "error") {
                    return {status: "error", message: 'There has been an error uploading the image, please try again later'}
                }
    
                const notionAuthKey = await DatabaseQuerys().getNotionAuthKey(userID)
    
                const response = await NotionQuerys(
									notionAuthKey.data
								).createPageWithBlock(databaseID, {
									blockType: "image",
									imageURL: uploadResponse.data.url,
									title: title,
									properties: properties,
								});
                console.log(response)
    
                return {status: "success", databaseTitle: response.databaseData.title.length <= 0 ?  "Untitled" : response.databaseData.title[0].text.content}
            } catch (err) {
                console.log(err)       
                return {status: "error"}
            }
        },
    
        async getproperties(userID, databaseID) {
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