const reply = require('../../scripts/reply');

function feedback(ctx) {
  reply(ctx, 'Do you want to give me feedback?\n\n<strong>Message me!</strong>\n<strong>@frankaP</strong>', { parse_mode: 'HTML' });
}

module.exports = feedback;
