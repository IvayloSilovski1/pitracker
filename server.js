const compression = require('compression')
const express = require('express')
const https = require('https')
const path = require('path')
const ejs = require('ejs')
const fs = require('fs')


// dotenv middleware
require('dotenv').config()

const app = express()
const expressLayouts = require('express-ejs-layouts');

// set template engine - ejs
app.set('view engine', 'ejs')
app.set('views', __dirname + '/resources/views')
app.use(expressLayouts);

// set up static folder for css and js files
app.use(express.static('public'))

// this will be the main page
app.set('layout', 'home')


// compress the data sent and recieved to the server -> to be faster
app.use(compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
        if(req.headers['x-no-compression']) return false
        return compression.filter(req, res)
    }
}))


app.get('/', (req, res) => {
    res.render('home')
})


// Secure connection with certificate
const sslserver = https.createServer({
    "key": fs.readFileSync(path.join(__dirname, process.env.DIR, process.env.KEY_CERTIFICATE)),
    "cert": fs.readFileSync(path.join(__dirname, process.env.DIR, process.env.CERTIFICATE))
}, app)

// PORT configuration
let PORT;
if(process.env.PORT) PORT = process.env.PORT
PORT = 3000

sslserver.listen(PORT, () => console.log(`Secure Server started on port ${PORT}`))