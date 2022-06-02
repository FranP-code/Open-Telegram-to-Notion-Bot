function cleanSessions(ctx, next) {

    const sessions = [ctx.session.textsForAdd, ctx.session.imagesForAdd]
    
    sessions.forEach(session => {
        // If all elements on the array are null, clean the array
        let allTextsAreNull = true

        session.forEach(element => {
            if (element !== null) {
                allTextsAreNull = false
            }
        })

        if (allTextsAreNull) {
            session = []
        }
    });

    next()
}

module.exports = cleanSessions