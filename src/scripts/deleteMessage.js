async function deleteMessage(ctx, messageId) {
  try {
    await ctx.api.deleteMessage(ctx.chat.id, messageId);
  } catch (error) {
    console.log(error);
  }
}

module.exports = deleteMessage;
