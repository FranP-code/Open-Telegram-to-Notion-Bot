function cleanSessions(ctx, next) {
    if (ctx.session.dataForAdd.length >= 15) {
        ctx.session.dataForAdd = ctx.session.dataForAdd.splice(1, ctx.session.dataForAdd.length - 1)
    }

    next()
}

module.exports = cleanSessions