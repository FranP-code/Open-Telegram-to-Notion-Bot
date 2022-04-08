const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(`mongodb+srv://Franka:${process.env.MONGODB_PASSWORD}@telegramtonotionbot.ilqnm.mongodb.net/TelegramToNotionBot?retryWrites=true&w=majority`)
    .catch(err => console.log(err))

mongoose.connection.once('open', () => {
    console.log("DB connected");
})

mongoose.connection.on('error', err => {
	console.log(err)
})