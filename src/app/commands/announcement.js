const reply = require("../../scripts/reply")

async function announcement(ctx) {
    if (ctx.from.id !== parseInt(process.env.MY_USER_ID)) {
        reply(ctx, "Sorry, this command is only for admins")
        return
    }

    ctx.session.waitingForAnnouncementMessage = true
    
    await reply(ctx, "Tell your announcement, king.\n\nIt gonna have an <strong>HTML format</strong>.", {parse_mode: "HTML"})
    reply(ctx, "Type CANCEL for cancel the announcement")
}

module.exports = announcement