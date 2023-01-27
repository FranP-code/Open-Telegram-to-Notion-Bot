const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  userId: {
    type: 'number',
    required: true,
  },
  notionAuthKey: {
    type: 'object',
    required: true,
  },
  defaultDatabaseName: {
    type: 'string',
  },
  defaultDatabaseId: {
    type: 'string',
  },
});

module.exports = model('Users', UserSchema);
