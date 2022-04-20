const Express = require('express')
const app = Express()
const port = (process.env.PORT || 3030)
require('dotenv').config()

//Enable CORS
const cors = require('cors');
app.use(cors())

//Configure Handlebars
const hbs = require('hbs')
hbs.registerPartials(__dirname + '/../views/partials')
app.set('view engine', 'hbs')

//Use public folder
app.use(Express.static('public'));

//Create master route
const masterRoute = Express.Router()

app.use('/api/v1', masterRoute)

//Import routes
const auth = require('./routes/authRouter.js')
masterRoute.use('/auth', auth)

masterRoute.get('/', (req, res) => {
    res.send('Welcome to the Telegram to Notion Bot Backend!')
})

masterRoute.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy')
})

masterRoute.get('/terms-of-use', (req, res)  => {
    res.render('terms-of-use')
})

app.listen(port, () => console.log('port', port))
