const Express = require('express')
const app = Express()
const port = (process.env.PORT || 3030)

const axios = require('axios')
require('dotenv').config()

const favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));

const hbs = require('hbs')

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

app.use(Express.static('public'));

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/auth', async (req, res) => {

    async function requestAccessToken() {
        try {
            const reqData = {
                code: req.query.code,
                grant_type: "authorization_code",
                redirect_uri: "https://telegram-to-notion.herokuapp.com/auth"
            }

            const auth = {
                Authorization: "Basic " + Buffer.from(`${process.env.NOTION_INTEGRATION_ID}:${process.env.NOTION_INTEGRATION_SECRET}`).toString('base64')
            }

            console.log(auth)

            const response = await axios({
                method: "POST",
                url: "https://api.notion.com/v1/oauth/token",
                data: reqData,
                auth: {
                    username: Buffer.from(process.env.NOTION_INTEGRATION_ID.toString('base64')),
                    password: Buffer.from(process.env.NOTION_INTEGRATION_SECRET.toString('base64'))
                } //THANK YOU https://stackoverflow.com/questions/67534080/notion-api-invalid-client-oauth-integration/68699544#68699544?newreg=949504cf865c4a52b2c0ce7afe936c9b
            })

            console.log(response.status) //400 in positive case
            console.log(response.data)

            /**
             * access_token: string,
             * token_type: string,
             * bot_id: string,
             * workspace_name: string,
             * workspace_icon: string,
             * workspace_id: string
             */

            return response
        }
        catch (error) {
            console.log("error")
            console.log(error)

            return {status: 400}
        }
    }

    const response = await requestAccessToken()

    res.render('auth', {
        name: "fran",
        success: response.status === 200 ? true : false,
        data: response.data
    })
})

app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy')
})

app.get('/terms-of-use', (req, res)  => {
    res.render('terms-of-use')
})

app.listen(port, () => console.log('port', port))