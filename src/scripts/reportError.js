const reply = require('./reply');

function reportError(ctx) {
  reply(ctx, 'Has been an error. Try again later');
}

module.exports = reportError;
