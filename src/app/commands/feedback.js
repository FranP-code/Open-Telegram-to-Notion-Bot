function feedback(ctx) {
    ctx.reply("Do you want to give me feedback?\n\n<strong>Message me!</strong>\n<strong>@frankaP</strong>", {parse_mode: "HTML"})
}

module.exports = feedback