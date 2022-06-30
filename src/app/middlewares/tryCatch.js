const reportError = require("../../scripts/reportError")

function tryCatch(ctx, next) {
    try {
        next()        
    } catch (err) {
        console.log(err)
        reportError(ctx)
    }
}

module.exports = tryCatch