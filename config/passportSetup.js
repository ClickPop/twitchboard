const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const request = require('request');
const airtable = require('airtable');
require('dotenv').config();

const { API_KEY, TWITCH_CLIENT_ID, TWITCH_SECRET, CALLBACK_URL } = process.env;

const base = new airtable({ apiKey: API_KEY }).base('appeqb1CAXVkBv8hN');

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
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    base('users').find(id, function(err, record) {
        if (err) {console.error(err); return;}
        done(null, record);
    })
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

            base('users')
                .select({
                    view: 'Grid view',
                    filterByFormula: `{id} = ${profile.data[0].id}`
                })
                .eachPage(
                    function page(records, fetchNextPage) {
                        if (records.length != 0) {
                            base('users').update([
                                {
                                  "id": records[0].id,
                                  "fields": profile.data[0]
                                }
                              ], function(err, records) {
                                if (err) {
                                  console.error(err);
                                  return;
                                }
                                profile.id = records[0].id;
                                done(null, profile);
                              });
                        } else {
                            base('users').create(
                                [
                                    {
                                        fields: profile.data[0]
                                    }
                                ],
                                function(err, records) {
                                    if (err) {
                                        console.error(err.message);
                                    }
                                    profile.id = records[0].id;
                                    done(null, profile);
                                }
                            );
                        }
                        fetchNextPage();
                    },
                    function done(err) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    }
                );
            // done(null, profile);
        }
    )
);