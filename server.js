const express = require('express');
const app = express();
const airtable = require('airtable');
const getReferrals = require('./middleware/getReferrals');
const useReferral = require('./middleware/useReferral');
require('dotenv').config();
const api_key = process.env.API_KEY;

app.set('views', './views');
app.set('view engine', 'pug');

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

app.use('/css', express.static('css'));

app.get('/', (req, res) => {
    res.send('API Running');
});

app.get('/:channel_id', getReferrals, (req, res) => {
    res.render('index');
});

app.get('/:channel_id/:referrer_id', useReferral, (req, res) => {
    // res.redirect(`https://twich.tv/${req.params.channel_id}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
