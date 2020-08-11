require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const routes = require('./routes/main');
const passwordRoutes = require('./routes/password')

const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin: process.env.CORS_ORIGIN}))

require('./auth/auth')

app.use('/', routes)
app.use('/', passwordRoutes)

//catch all other routes
app.use((req, res) => {
    res.status(404).json({ message: '404 NOT FOUND', status: 404 })
})
//handle errors
app.use((req, res, next) => {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message, status: 500 })
})

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})

