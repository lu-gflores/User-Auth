const express = require('express')
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
const crypto = require('crypto')
const UserModel = require('../models/UserModel')

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
        defaultLayout: null,
        partialsDir: './templates/',
        layoutsDir: './templates/'
    },
    viewPath: path.resolve('./templates/'),
    extName: '.html'
}

smtpTransport.use('compile', hbs(handlebarsOptions))

const router = express.Router() //new express router instance

router.post('/forgot-password', async (req, res) => {
    const  userEmail  = req.body.email;
    const user =  await UserModel.findOne({email: userEmail});
    if(!user) {
        res.status(400).json( {message: 'invalid email', status: 400})
        return;
    }

    //creating user token
    const buffer = crypto.randomBytes(20);
    const token = buffer.toString('hex');

    //update user reset pass
    await UserModel.findByIdAndUpdate({ _id:user._id}, {resetToken: token, resetTokenExp: Date.now() + 60000})

    const emailOptions = {
        to: userEmail,
        from: email,
        template: 'forgot-password',
        subject: 'Zenva PHASER MMO Password Reset',
        context: {
            name: 'john',
            url: `http://localhost:${process.env.PORT || 3000}`
        }
    }
    await smtpTransport.sendMail(emailOptions)

    res.status(200).json({ message: 'An email has been sent to your email address. Reset link is valid for 10 mins.', status: 200 })
  
})

router.post('/reset-password', async (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        const userEmail = req.body.email

        const emailOptions = {
            to: userEmail,
            from: email,
            template: 'reset-password',
            subject: 'Zenva PHASER MMO Password Reset Confirmation',
            context: {
                name: 'john',
            }
        }
        await smtpTransport.sendMail(emailOptions)

        res.status(200).json({ message: 'Password updated', status: 200 })
    }
})
module.exports = router;