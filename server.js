const path = require('path');
const express = require('express');
const app = express();

const processLeaderboard = require('./middleware/processLeaderboard');
const setTheme = require('./middleware/setTheme');
const resetLeaderboard = require('./middleware/resetLeaderboard');
const getLeaderboardSettings = require('./middleware/getLeaderboardSettings');
const getReferrals = require('./middleware/getReferrals');
const useReferral = require('./middleware/useReferral');
const requestIP = require('./middleware/requestIP');
const excludeFavicon = require('./middleware/exludeFavicon');
require('dotenv').config();

function errorHandler (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(excludeFavicon);

// Root Route
app.get('/', (req, res) => {
    res.send('API is running.');
});

// Admin Routes
app.get('/admin/:channel_id', getLeaderboardSettings, getReferrals, processLeaderboard, (req, res) => {
    res.render('admin');
});
app.get('/admin/:channel_id/reset', getLeaderboardSettings, resetLeaderboard);
app.post('/admin/:channel_id/set-theme/:theme', getLeaderboardSettings, setTheme);
app.get('/admin', (req, res) => {
    res.send('Thou shalt not pass!');
});

app.get('/:channel_id', getLeaderboardSettings, getReferrals, processLeaderboard, (req, res) => {
    res.render('index');
});

// Referral Route
app.get('/:channel_id/:referrer_id', requestIP, useReferral);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
