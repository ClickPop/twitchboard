var express = require('express');
var router = express.Router();
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var request = require('request');
require('dotenv').config();

const { TWITCH_CLIENT_ID, TWITCH_SECRET, CALLBACK_URL } = process.env;

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

			// Securely store user profile in your DB
			//User.findOrCreate(..., function(err, user) {
			//  done(err, user);
			//});

			done(null, profile);
		}
	)
);

router.get('/', (req, res) => {
	passport.authenticate('twitch', { scope: 'channel_read' });
});

router.get('/redirect', (req, res) => {
	passport.authenticate('twitch', {
		successRedirect: `/admin/${res.data[0].display_name}`,
		failureRedirect: '/'
	});
});

module.exports = router;
