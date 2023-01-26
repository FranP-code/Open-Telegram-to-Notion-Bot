const UserSchema = require('../schemas/UserSchema');
require('../dbConnection');

async function searchAllUsers() {
  try {
    const data = await UserSchema.find({});
    if (!data) {
      return { status: 'error' };
    }
    return { status: 'success', data };
  } catch (err) {
    console.log(err);
    throw Error(err);
  }
}

module.exports = searchAllUsers;
