const UserSchema = require("../schemas/UserSchema")
require('../dbConnection')

async function searchAllUsers() {
    try {
        const data = await UserSchema.find({})

        if (!data) {
            return {status: "error"}
        } else {
            return {status: "success", data}
        }

    } catch (err) {
        console.log(err)
    }
}

module.exports = searchAllUsers