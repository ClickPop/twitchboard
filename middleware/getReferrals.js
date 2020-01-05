const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

module.exports = async function(req, res, next) {
    var users = [];
    var i = 0;
    const channel = req.params.channel_id;

    await base('referrals')
        .select({
            view: 'Grid view',
            fields: ['referrer', 'channel', 'data-hash'],
            filterByFormula: `{channel} = "${channel}"`
        })
        .eachPage(
            function page(records, fetchNextPage) {
                records.forEach(function(record) {
                    users.push(record.fields);
                });
                fetchNextPage();
                res.locals.result = users.map(user => JSON.stringify(user));
                next();
            },
            function done(err) {
                if (err) {
                    console.error(err);
                    return;
                }
            }
        );
};
