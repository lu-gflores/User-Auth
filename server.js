const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/status', (req, res) => {
    res.status(200).json({ message: 'ok', status: 200 })
})

app.post('/signup', (req, res, next) => {
    if (!req.body) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        res.status(200).json({ message: 'ok', status: 200 })

    }
})

app.post('/login', (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        res.status(200).json({ message: 'ok', status: 200 })
    }
})

app.post('/logout', (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        res.status(200).json({ message: 'ok', status: 200 })

    }
})

app.post('/token', (req, res) => {
    if (!req.body || !req.body.refreshToken) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        const { refreshToken } = req.body
        res.status(200).json({ message: `refresh token requested for token: ${refreshToken}`, status: 200 })
    }
})

app.post('/forgot-password', (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        const { email } = req.body
        res.status(200).json({ message: `forgot password request for email: ${email}`, status: 200 })
    }
})

app.post('/reset-password', (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        const { email } = req.body
        res.status(200).json({ message: `password reset request for email: ${email}`, status: 200 })
    }
})

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

