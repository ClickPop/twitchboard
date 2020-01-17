const path = require('path');
const express = require('express');
const app = express();
const { query, validationResult, sanitizeQuery } = require('express-validator');

const processLeaderboard = require('./middleware/processLeaderboard');
const setTheme = require('./middleware/setTheme');
const resetLeaderboard = require('./middleware/resetLeaderboard');
const getLeaderboardSettings = require('./middleware/getLeaderboardSettings');
const getReferrals = require('./middleware/getReferrals');
const useReferral = require('./middleware/useReferral');
const requestIP = require('./middleware/requestIP');
const excludeFavicon = require('./middleware/exludeFavicon');
const buildJSON = require('./middleware/buildJSON');
require('dotenv').config();

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(excludeFavicon);

// Root Route
app.get('/', (req, res) => {
    res.render('homepage');
    //res.send('API is running.');
});

// Admin Routes
app.get(
    '/admin/:channel',
    getLeaderboardSettings,
    getReferrals,
    processLeaderboard,
    (req, res) => {
        res.render('admin');
    }
);
app.get('/admin/:channel/reset', getLeaderboardSettings, resetLeaderboard);
app.post('/admin/:channel/set-theme/:theme', getLeaderboardSettings, setTheme);
app.get('/admin', (req, res) => {
    res.send('Thou shalt not pass!');
});

app.get(
    '/:channel',
    getLeaderboardSettings,
    getReferrals,
    processLeaderboard,
    (req, res) => {
        res.render('index');
    }
);

app.get(
    '/api/v1/getReferrals',
    [
        query('channel')
            .exists().withMessage('Please specify a channel')
            .custom(channel => {
                if (channel != undefined && channel.search(/[^a-z_]/) > -1) {
                    throw new Error('Channel contains invalid characters')
                } else {
                    return true;
                }
            })
            .trim()
            .escape(),
        query('referrer')
            .optional()
            .trim()
            .escape(),
        query('since')
            .optional()
            .isISO8601()
    ],
    getReferrals,
    buildJSON,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        res.json(req.data);
    }
);

app.get(
    '/api/v1/getLeaderboard',
    [
        query('channel')
            .exists().withMessage('Please specify a channel')
            .custom(channel => {
                if (channel != undefined && channel.search(/[^a-z_]/) > -1) {
                    throw new Error('Channel contains invalid characters')
                } else {
                    return true;
                }
            })
            .trim()
            .escape(),
        query('referrer')
            .optional()
            .trim()
            .escape(),
        query('since')
            .optional()
            .isISO8601()
    ],
    getReferrals,
    getLeaderboardSettings,
    processLeaderboard,
    buildJSON,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        res.json(req.data);
    }
);

// Referral Route
app.get('/:channel/:referrer', requestIP, useReferral);

app.get('*', function(req, res){
    res.status(404).send('Not Found');
  });

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
