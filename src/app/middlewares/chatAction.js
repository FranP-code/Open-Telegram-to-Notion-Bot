function chatAction(ctx, next) {
    if (!ctx.update.callback_query) {
        ctx.replyWithChatAction("typing")
    }
    next()
}

module.exports = chatAction