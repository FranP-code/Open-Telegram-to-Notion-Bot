async function reply(ctx, text, data) {
    try {
        await ctx.reply(text, data)
    } catch (err) {
        console.log(err)
    }
}

module.exports = reply