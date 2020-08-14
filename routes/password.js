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
    const userEmail = req.body.email;
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
        res.status(400).json({ message: 'invalid email', status: 400 })
        return;
    }

    //creating user token
    const buffer = crypto.randomBytes(20);
    const token = buffer.toString('hex');

    //update user reset pass
    await UserModel.findByIdAndUpdate({ _id: user._id }, { resetToken: token, resetTokenExp: Date.now() + 60000 })

    const emailOptions = {
        to: userEmail,
        from: email,
        template: 'forgot-password',
        subject: 'Zenva PHASER MMO Password Reset',
        context: {
            name: 'john',
            url: `http://localhost:${process.env.PORT || 3000}?token=${token}`
        }
    }
    await smtpTransport.sendMail(emailOptions)

    res.status(200).json({ message: 'An email has been sent to your email address. Reset link is valid for 10 mins.', status: 200 })

})

router.post('/reset-password', async (req, res) => {
    const userEmail = req.body.email
    const user = await UserModel.findOne({ resetToken: req.body.token, resetTokenExp: { $gt: Date.now() }, email: userEmail })

    if (!user) {
        res.status(400).json({ message: 'invalid token', status: 400 })
        return;
    }

    //checking if password is provided and matches verified password
    if(!req.body.password || !req.body.verifiedPassword || req.body.password !== req.body.verifiedPassword) {
        res.status(400).json({ message: 'passwords do not match.', status: 400 })
        return;
    }

    //modifing user model
    user.password =  req.body.password;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();


    const emailOptions = {
        to: userEmail,
        from: email,
        template: 'reset-password',
        subject: 'Zenva PHASER MMO Password Reset Confirmation',
        context: {
            name: user.username,
        }
    }
    await smtpTransport.sendMail(emailOptions)

    res.status(200).json({ message: 'Password updated', status: 200 })

})
module.exports = router;