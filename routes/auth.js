const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportSetup = require('../config/passportSetup');
require('dotenv').config();

router.get('/login', passport.authenticate('twitch', { scope: 'user_read' }));

router.get(
    '/redirect',
    passport.authenticate('twitch', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect(`../admin/${req.user.data[0].display_name}`)
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('../');
})

module.exports = router;
