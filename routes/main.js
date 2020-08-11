const express = require('express')
const passport = require('passport')
const router = express.Router() //new express router instance

router.get('/', (req, res) => {
    res.send('hello world')
})

router.get('/status', (req, res) => {
    res.status(200).json({ message: 'ok', status: 200 })
})

router.post('/signup', passport.authenticate('signup', {session: false}), (req, res, next) => {
    res.status(200).json({ message: 'signup successful', status: 200 })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('login', (error, user) => {
        try {
            if(error) {
                return next(error)
            }
            if(!user) {
                return next(new Error('email and password are required'))
            }

            req.login(user, {session: false }, (err) => {
                if(err) return next(err);
                return resizeBy.status(200).json({ user, status: 200})
            })
        } catch(err) {
            console.log(err)
            return next(err)
        }
    }) (req, res, next);

})

router.post('/logout', (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        res.status(200).json({ message: 'ok', status: 200 })
    }
})

router.post('/token', (req, res) => {
    if (!req.body || !req.body.refreshToken) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        const { refreshToken } = req.body
        res.status(200).json({ message: `refresh token requested for token: ${refreshToken}`, status: 200 })
    }
})
module.exports = router;