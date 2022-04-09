const DatabaseQuerys = require("./DatabaseQuerys")
const NotionQuerys = require("./NotionQuerys")

function AppController() {

    async function getNotionDatabases(userId) {
        const userRegistered = await DatabaseQuerys().checkUserRegistered(userId)

        if (userRegistered.status === "error") {
            return {
                status: "error",
                message: "no auth code"
            }
        }

        const notionAuthKey = await DatabaseQuerys().getNotionAuthKey(userId)
        return await NotionQuerys(notionAuthKey.data).returnAllDatabases()
    }

    async function addMessageToNotionDatabase(userId, databaseId, message) {
        const notionAuthKey = await DatabaseQuerys().getNotionAuthKey(userId)
    
        const response = await NotionQuerys(notionAuthKey.data).addTextToDatabase(databaseId, message)
        const databaseData = await NotionQuerys(notionAuthKey.data).getDatabaseData(databaseId)

        response.databaseTitle = databaseData.title[0].text.content
        return response
    }

    return {
        getNotionDatabases,
        addMessageToNotionDatabase
    }
}

module.exports = AppController