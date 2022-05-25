function chatAction(ctx, next) {
    ctx.replyWithChatAction("typing")
    next()
}

module.exports = chatAction