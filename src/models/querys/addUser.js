require('../dbConnection');
const { encrypt } = require('../crypto');
const UserSchema = require('../schemas/UserSchema');

async function addUser(userId, notionAuthKey) {
  const encryptedNotionAuthKey = encrypt(notionAuthKey);

  try {
    const data = await UserSchema.findOneAndUpdate({ userId }, { userId, notionAuthKey });

    if (!data) {
      const userSchemaCreate = new UserSchema({
        userId,
        encryptedNotionAuthKey,
      });
      await userSchemaCreate.save();
    }

    return { status: 'success' };
  } catch (error) {
    console.log(error);
    return { status: 'error' };
  }
}

module.exports = addUser;
