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
            if (err) { next(err); return; }

            try {
                records.forEach(function(record) {
                    res.locals.leaderboardSettings = record.fields;
                });
            } catch(e) {
                next(e); return;
            }
            next();
        });
};
