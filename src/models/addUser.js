require('./dbConnection')
const { encrypt } = require('./crypto')
const UserSchema = require('./schemas/UserSchema')

async function addUser(userId, notionAuthKey) {

    notionAuthKey = encrypt(notionAuthKey)

    try {
        const data = await UserSchema.findOneAndUpdate({userId: userId}, {userId: userId, notionAuthKey})
        
        if (!data) {
            const data = new UserSchema({
                userId: userId,
                notionAuthKey
            })
            await data.save()
        }
        
        return {status: "success"}
    } catch (error) {
        console.log(error)
        return {status: "error"}
    }
}

module.exports = addUser