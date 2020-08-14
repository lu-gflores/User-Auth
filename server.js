require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const monogoose = require('mongoose')
const routes = require('./routes/main');
const passwordRoutes = require('./routes/password')
const secureRoutes = require('./routes/secure')
const passport = require('passport')

const PORT = process.env.PORT || 8080;
const uri = process.env.MONGO_CONNECTION_URL;
const mongoConfig = {
    useNewUrlParser:  true,
    useCreateIndex: true,
}

if(process.env.MONGO_USER_NAME && process.env.MONGO_PASSWORD) {
    mongoConfig.auth = {authSource: 'admin'}
    mongoConfig.user = process.env.MONGO_USER_NAME
    mongoConfig.pass = process.env.MONGO_PASSWORD
}
monogoose.connect(uri, mongoConfig);
monogoose.connection.on('error', (error)=> {
    console.log(error)
    process.exit(1)
})
monogoose.set('useFindAndModify', false)

const app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin: process.env.CORS_ORIGIN}))

require('./auth/auth')

app.use('/', routes)
app.use('/', passwordRoutes)
app.use('/',  passport.authenticate('jwt', { session: false }) , secureRoutes)
//catch all other routes
app.use((req, res) => {
    res.status(404).json({ message: '404 NOT FOUND', status: 404 })
})
//handle errors
app.use((req, res, next) => {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message, status: 500 })
})


monogoose.connection.on('connected',()=>{
    console.log('connected to mongo')
    app.listen(PORT, () => {
        console.log('Listening on port ' + PORT)
    })    
})