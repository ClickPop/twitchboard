const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

module.exports = function(req, res, next) {
    const channel = req.params.channel_id;
    var tempID = null;
    var currentTime = new Date();
    currentTime = currentTime.toISOString();

    base('leaderboards')
        .select({
            view: 'Grid view',
            fields: ['channel'],
            filterByFormula: `{channel} = "${channel}"`,
            maxRecords: 1
        })
        .firstPage(function(err, records) {
            if (err) { next(err); return; }

            try {
                records.forEach(function(record) {
                    tempID = record.id;
                    base('leaderboards').update([
                        {
                            "id": tempID,
                            "fields": {"reset-timestamp": currentTime}
                        }
                    ], function(err, records) {
                        if (err) {
                            next(err);
                        }
                        records.forEach(function(record) {
                            console.log('Reset leaderboard', record.get('channel'));
                        });
                    });
                });
            } catch(err) {
                next(err);
            }
            res.redirect(`/admin/${channel}`);
        });
    };
