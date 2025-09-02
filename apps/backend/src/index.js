const Express = require('express')
const app = Express()
const port = (process.env.PORT || 5050)
require('dotenv').config()

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Enable body json
app.use(Express.json())

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
