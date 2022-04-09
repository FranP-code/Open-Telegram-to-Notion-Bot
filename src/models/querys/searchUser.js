const UserSchema = require('../schemas/UserSchema')
require('../dbConnection')

async function searchUser(userId) {
    
    try {
        const data = await UserSchema.findOne({userId})
        
        if (!data) {
            return {status: "error"}
        } else {
            return {status: "success", data}
        }
    
    } catch (err) {

        console.log(err)
        return {status: "error"}
    }
}

module.exports = searchUser