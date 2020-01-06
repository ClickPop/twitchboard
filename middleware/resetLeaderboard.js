const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

module.exports = async function(req, res, next) {
    var leaderboard = null;
    var i = 0;
    const channel = req.params.channel_id;
    res.locals.channel = channel;
    var tempID = null;
    var currentTime = new Date();
    currentTime = currentTime.toISOString();

    await base('leaderboards')
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
                            "id": "rec4UsbCHEoW5BAoF",
                            "fields": {"reset-timestamp": currentTime}
                        }
                    ], function(err, records) {
                        if (err) {
                            console.error(err);
                            next(err); return;
                        }
                        records.forEach(function(record) {
                            console.log('Reset leaderboard', record.get('channel'));
                        });
                    });
                });
            } catch(err) {
                next(err); return;
            }
            res.redirect(`/admin/${channel}`);
            next();
        });
    };
