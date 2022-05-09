async function announcement(ctx) {
    if (ctx.from.id !== parseInt(process.env.MY_USER_ID)) {
        ctx.reply("Sorry, this command is only for admins")
        return
    }

    ctx.session.waitingForAnnouncementMessage = true
    
    await ctx.reply("Tell your announcement, king.\n\nIt gonna have an <strong>HTML format</strong>.", {parse_mode: "HTML"})
    ctx.reply("Type CANCEL for cancel the announcement")
}

module.exports = announcement