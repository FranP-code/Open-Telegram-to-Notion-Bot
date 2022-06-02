const { decrypt } = require("../models/crypto")
const NotionQuerys = require("./NotionQuerys")

const addUser = require("../models/querys/addUser")
const searchUser = require("../models/querys/searchUser")
const searchAllUsers = require('../models/querys/searchAllUsers')
const uploadImage = require("../models/querys/uploadImage")

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

    async function checkUserRegistered(userId) {
        return await searchUser(userId)
    }

    async function getNotionAuthKey(userId) {
        const response = await searchUser(userId)

        if (response.status === "error") {
            return response
        }

        return {success: true, data: decrypt(response.data.notionAuthKey)}
    }

    async function getUser(userId) {
        try {
            return await searchUser(userId)
        } catch (err) {
            console.log(err)
        }
    }

    async function getAllUsers() {
        try {
            return await searchAllUsers()
        } catch (err) {
            console.log(err)
        }
    }

    async function uploadAndGetImageURL(url) {
        try {
            const data = await uploadImage(url)

            return {
                status: "success",
                data: {
                    url: data.url
                }
            }
        } catch (err) {
            console.log(err)
            return {status: "error"}
        }
    }

    return {
        uploadApiKey,
        checkUserRegistered,
        getNotionAuthKey,
        getUser,
        getAllUsers,
        uploadAndGetImageURL
    }
}

module.exports = DatabaseQuerys