const express = require('express');
const router = express.Router();
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const request = require('request');
const airtable = require('airtable');
require('dotenv').config();

const { API_KEY, TWITCH_CLIENT_ID, TWITCH_SECRET, CALLBACK_URL } = process.env;

const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
    var options = {
        url: 'https://api.twitch.tv/helix/users',
        method: 'GET',
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            Accept: 'application/vnd.twitchtv.v5+json',
            Authorization: 'Bearer ' + accessToken
        }
    };

    request(options, function(error, response, body) {
        if (response && response.statusCode == 200) {
            done(null, JSON.parse(body));
        } else {
            done(JSON.parse(body));
        }
    });
};

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(
    'twitch',
    new OAuth2Strategy(
        {
            authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
            tokenURL: 'https://id.twitch.tv/oauth2/token',
            clientID: TWITCH_CLIENT_ID,
            clientSecret: TWITCH_SECRET,
            callbackURL: CALLBACK_URL,
            state: true
        },
        function(accessToken, refreshToken, profile, done) {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            console.log(profile);
			
			await base('users').create(
			[
				{
					fields: tableData
				}
			],
			function(err, records) {
				if (err) {
					next(err);
				}

				res.redirect(`https://twitch.tv/${channel}`);
			}
		);

            done(null, profile);
        }
    )
);

router.get('/login', passport.authenticate('twitch', { scope: 'user_read' }));

router.get(
    '/redirect',
    passport.authenticate('twitch', { failureRedirect: '/' }),
    (req, res) => {
        // res.redirect(`../admin/`);
    }
);

module.exports = router;
