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
});

module.exports = model('Users', UserSchema);
