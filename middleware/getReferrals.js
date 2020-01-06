const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

module.exports = function(req, res, next) {
    console.log('router-level-middleware', req.url);
    var data = [];
    const channel = req.params.channel_id;

    base('referrals')
        .select({
            view: 'Grid view',
            fields: ['referrer', 'channel', 'data-hash'],
            filterByFormula: `{channel} = "${channel}"`
        })
        .eachPage(
            function page(records, fetchNextPage) {
                records.forEach(function(record) {
                    data.push(record.fields);
                });
                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    next(err);
                }

                // data.forEach((referral))


                res.locals.result = data.map(user => JSON.stringify(user));
                next();
            }
        );
};
