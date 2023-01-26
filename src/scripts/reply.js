async function reply(ctx, text, data) {
  try {
    await ctx.reply(text, { ...data, parse_mode: 'HTML' });
  } catch (err) {
    console.log(err);
  }
}

module.exports = reply;
