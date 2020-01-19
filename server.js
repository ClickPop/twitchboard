const path = require('path');
const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const passport = require('passport');
require('dotenv').config();

const { excludeFavicon } = require('./middleware/middleware');

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(excludeFavicon);

app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [process.env.SESSION_SECRET]
    })
);


app.use(passport.initialize());
app.use(passport.session());

// Root Route
app.get('/', (req, res) => {
    res.render('homepage');
});

app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));
app.use('/leaderboard', require('./routes/leaderBoard'));
app.use('/referral', require('./routes/referral'));

// app.get('*', function(req, res) {
// 	res.status(404).send('Not Found');
// });

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
