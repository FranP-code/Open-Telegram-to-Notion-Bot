const DatabaseQuerys = require('../../controller/DatabaseQuerys');
const reply = require('../../scripts/reply');

async function announcementHandler(ctx, next) {
  if (ctx.session.waitingForAnnouncementMessage) {
    ctx.session.waitingForAnnouncementMessage = false;

    // Check if user is not me
    if (ctx.from.id !== parseInt(process.env.MY_USER_ID, 10)) {
      reply(ctx, '<strong>What the fuck are you doing here?</strong>', { parse_mode: 'HTML' });
      ctx.api.sendMessage(process.env.MY_USER_ID, 'Somebody is making announcements. STOP THE BOT.', { parse_mode: 'HTML' });
      return;
    }

    // Check if the announcement have been cancelled
    if (ctx.message.text.trim().toLowerCase() === 'cancel') {
      reply(ctx, 'Announcement cancelled');
      return;
    }

    let users;

    if (process.env.NODE_ENV === 'develop') {
      users = [
        await DatabaseQuerys().getUser(process.env.TESTING_USER_ID),
        await DatabaseQuerys().getUser(process.env.MY_USER_ID),
      ];
      users = users.map((user) => user.data); // wtf js
    }

    if (process.env.NODE_ENV === 'production') {
      users = await DatabaseQuerys().getAllUsers();
      users = users.data; // wtf js
    }

    users.forEach((user, index) => {
      setTimeout(async () => {
        try {
          await ctx.api.sendMessage(user.userId, ctx.message.text, { parse_mode: 'HTML' });
          console.log(`Message sended to ${user.userId}`);
        } catch (err) {
          console.log(err);
        }

        if (index === users.length - 1) {
          reply(ctx, 'Announcement complete.');
        }
      }, 30000 * index);
    });
  } else {
    next();
  }
}

module.exports = announcementHandler;
