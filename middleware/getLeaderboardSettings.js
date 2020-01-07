const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

module.exports = function(req, res, next) {
    const channel = req.params.channel_id;
    res.locals.channel = channel;

    base('leaderboards')
        .select({
            view: 'Grid view',
            filterByFormula: `{channel} = "${channel}"`,
            maxRecords: 1
        })
        .firstPage(function(err, records) {
            if (err) { next(err); }

            try {
                records.forEach(function(record) {
                    res.locals.leaderboardSettings = record.fields;
                    res.locals.leaderboardSettings.id = record.id;
                });

                if (records.length === 0) {
                    base('leaderboards').create([
                      {
                        "fields": {
                          "channel": channel,
                          "theme": "retro",
                          "background-opacity": 1
                        }
                      },
                    ], function(err, records) {
                      if (err) {
                        next(err);
                      }
                      records.forEach(function (record) {
                          res.locals.leaderboardSettings = record.fields;
                          res.locals.leaderboardSettings.id = record.id;
                      });
                    });
                }
            } catch(e) {
                next(e); return;
            }
            next();
        });
};
