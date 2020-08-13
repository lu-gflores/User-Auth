const express = require('express')
const passport = require('passport')
const router = express.Router() //new express router instance
const tokenList = {};
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    res.send('hello world')
})

router.get('/status', (req, res) => {
    res.status(200).json({ message: 'ok', status: 200 })
})

router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
    res.status(200).json({ message: 'signup successful', status: 200 })
})

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (error, user) => {
        try {
            if (error) {
                return next(error)
            }
            if (!user) {
                return next(new Error('email and password are required'))
            }

            req.login(user, { session: false }, (err) => {
                if (err) return next(err);
                const body = {
                    _id: user._id,
                    email: user.email,
                    name: user.username

                };

                const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: 89400 })
                const refreshToken = jwt.sign({ user: body }, process.env.JWT_REFRESH_SECRET, { expiresIn: 89400 })

                res.cookie('jwt', token);
                res.cookie('refreshJwt', refreshToken);
                tokenList[refreshToken] = {
                    token,
                    refreshToken,
                    email: user.email,
                    _id: user._id,
                    name: user.name
                }

                return res.status(200).json({ token, refreshToken, status: 200 })

            })
        } catch (err) {
            console.log(err)
            return next(err)
        }
    })(req, res, next);

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