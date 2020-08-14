const express = require('express')
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

//storing email and password
const email = process.env.EMAIL; 
const password = process.env.PASSWORD;

const smtpTransport = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
        user: email,
        pass: password
    }
});

const handlebarsOptions = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: './templates/',
        layoutsDir: './templates/'
    },
    viewPath: path.resolve('./templates/'),
    extName: '.html'
}

smtpTransport.use('compile', hbs(handlebarsOptions))

const router = express.Router() //new express router instance

router.post('/forgot-password', (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        const { email } = req.body
        res.status(200).json({ message: `forgot password request for email: ${email}`, status: 200 })
    }
})

router.post('/reset-password', (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        const { email } = req.body
        res.status(200).json({ message: `password reset request for email: ${email}`, status: 200 })
    }
})
module.exports = router;