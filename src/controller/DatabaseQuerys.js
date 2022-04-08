const addUser = require("../models/addUser")
const NotionQuerys = require("./NotionQuerys")

function DatabaseQuerys() {

    async function uploadApiKey(userId, apiKey) {
        const responseNotion = await NotionQuerys(apiKey).checkAuthCode()

        if (responseNotion.status === "error") {
            responseNotion.message = "Auth key not valid"
            return responseNotion
        }

        const responseMongoDB = await addUser(userId, apiKey)
        return responseMongoDB
    }
    return {
        uploadApiKey
    }
}

module.exports = DatabaseQuerys