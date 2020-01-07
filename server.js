const path = require('path');
const express = require('express');
const app = express();

const processLeaderboard = require('./middleware/processLeaderboard');
const resetLeaderboard = require('./middleware/resetLeaderboard');
const getLeaderboardSettings = require('./middleware/getLeaderboardSettings');
const getReferrals = require('./middleware/getReferrals');
const useReferral = require('./middleware/useReferral');
require('dotenv').config();

function errorHandler (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/public', express.static(path.join(__dirname, 'public')));

// Root Route
app.get('/', (req, res) => {
    res.send('API is running.');
});

app.get('/admin', (req, res) => {
    res.send('Thou shalt not pass!');
})
app.get('/admin/:channel_id', getLeaderboardSettings, getReferrals, processLeaderboard, (req, res) => {
    res.render('admin');
});
app.get('/admin/:channel_id/reset', resetLeaderboard);
app.get('/admin', (req, res) => {
    res.send('Thou shalt not pass!');
});

app.get('/:channel_id', getReferrals, processLeaderboard, (req, res) => {
    res.render('index');
});

// Referral Route
app.get('/:channel_id/:referrer_id', useReferral, (req, res) => {
    res.render('index');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
