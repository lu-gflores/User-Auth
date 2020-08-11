const express = require('express')
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