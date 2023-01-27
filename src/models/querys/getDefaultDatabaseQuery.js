const UserSchema = require('../schemas/UserSchema');

async function getDefaultDatabaseQuery(userId) {
  const data = await UserSchema.findOne({ userId }, ['defaultDatabaseId', 'defaultDatabaseName']);
  return data;
}

module.exports = getDefaultDatabaseQuery;
