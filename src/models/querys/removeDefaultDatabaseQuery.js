const UserSchema = require('../schemas/UserSchema');

async function removeDefaultDatabaseQuery(userId) {
  return UserSchema.findOneAndUpdate(
    { userId },
    { defaultDatabaseName: null, defaultDatabaseId: null },
    { returnDocument: 'before' },
  );
}

module.exports = removeDefaultDatabaseQuery;
