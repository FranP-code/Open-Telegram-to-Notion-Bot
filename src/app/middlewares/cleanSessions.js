function cleanSessions(ctx, next) {
    // If all elements on the array are null, clean the array
    let allTextsAreNull = true

    ctx.session.dataForAdd.forEach(element => {
        if (element !== null) {
            allTextsAreNull = false
        }
    })

    if (allTextsAreNull) {
        ctx.session.dataForAdd = []
    }

    next()
}

module.exports = cleanSessions