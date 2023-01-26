async function chatAction(ctx, next) {
  if (!ctx.update.callback_query) {
    try {
      await ctx.replyWithChatAction('typing');
    } catch (err) {
      console.log(err);
    }
  }
  next();
}

module.exports = chatAction;
