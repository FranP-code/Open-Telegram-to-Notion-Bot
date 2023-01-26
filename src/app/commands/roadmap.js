const reply = require('../../scripts/reply');

function roadmap(ctx) {
  reply(ctx, 'Sure, here is the <strong>Telegram to Notion Bot\'s Roadmap</strong> 👇\n\nhttps://franpcode.notion.site/franpcode/3ef68732c1f9426dbdaba21e20dc3509?v=660b09746d4d4ede877a477d3b628f02', { parse_mode: 'HTML' });
}

module.exports = roadmap;
