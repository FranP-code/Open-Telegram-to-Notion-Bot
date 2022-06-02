const DatabaseQuerys = require("./DatabaseQuerys")
const NotionQuerys = require("./NotionQuerys")

function AppController() {

    async function getNotionDatabases(userID) {
        const userRegistered = await DatabaseQuerys().checkUserRegistered(userID)

        if (userRegistered.status === "error") {
            return {
                status: "error",
                message: "no auth code"
            }
        }

        const notionAuthKey = await DatabaseQuerys().getNotionAuthKey(userID)
        return await NotionQuerys(notionAuthKey.data).returnAllDatabases()
    }

    async function addMessageToNotionDatabase(userID, databaseId, message) {
        const notionAuthKey = await DatabaseQuerys().getNotionAuthKey(userID)
    
        const response = await NotionQuerys(notionAuthKey.data).addTextToDatabase(databaseId, message)
        const databaseData = await NotionQuerys(notionAuthKey.data).getDatabaseData(databaseId)

        response.databaseTitle = databaseData.title.length <= 0 ?  "Untitled" : databaseData.title[0].text.content
        return response
    }

    async function getKeyboardOfDatabases(databases, cancelOperationText, dataType, sessionStorage) {

        /**
         * * db_ = database_id
         * * dt_ = dataType
         * * i_ = indexOnSession
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
                                    callback_data: "db_" + obj.id + "dt_" + dataType + "i_" + JSON.stringify(sessionStorage.length - 1)
                                }]
                            } else {
                                return [{
                                    text: title,
                                    callback_data: "db_" + obj.id + "dt_" + dataType + "i_" + JSON.stringify(sessionStorage.length - 1)
                                }]
                            }
                        }),
                        [
                            {
                                text: !cancelOperationText ? "🚫" : cancelOperationText,
                                callback_data: `co_` + "dt_" + dataType + `i_` + JSON.stringify(sessionStorage.length - 1)
                            }
                        ]
                    ]
            }
        }
    }

    async function addImageToDatabase(userID, databaseID, imageURL, title) {

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
                    title: title
                })
            console.log(response)

            return {status: "success", databaseTitle: response.databaseData.title.length <= 0 ?  "Untitled" : response.databaseData.title[0].text.content}
        } catch (err) {
            console.log(err)       
            return {status: "error"}
        }
    }

    return {
        getNotionDatabases,
        addMessageToNotionDatabase,
        getKeyboardOfDatabases,
        addImageToDatabase
    }
}

module.exports = AppController