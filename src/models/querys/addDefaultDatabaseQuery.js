const NotionQuerys = require('../../controller/NotionQuerys');
const UserSchema = require('../schemas/UserSchema');

async function addDefaultDatabaseQuery(databaseId, userId, notionAuthKey) {
  const databaseData = await NotionQuerys(notionAuthKey)
    .getDatabaseData(databaseId);
  const data = await UserSchema.findOneAndUpdate(
    { userId },
    { defaultDatabaseName: databaseData.title[0].text.content, defaultDatabaseId: databaseId },
    { returnDocument: 'after' },
  );
  return data;
}

module.exports = addDefaultDatabaseQuery;
