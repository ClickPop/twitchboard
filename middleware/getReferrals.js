const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

function isLower(character) {
    if (/[a-zA-Z]/) {
        character = character.toLowerCase();
        return character;
    }
}

module.exports = function(req, res, next) {
    var referrals = [];
    var channel = req.query.channel || req.params.channel;
    var { referrer, since } = req.query;

    channel = [...channel]
        .map(character => isLower(character))
        .toString()
        .split(',')
        .join('');

    var formula = `{channel} = "${channel}"`;
    if (referrer != undefined) {
        formula = formula + `, {referrer} = "${referrer}"`;
    }

    if (since != undefined) {
        formula = formula + `, IS_AFTER({timestamp}, "${since}")`;
    }

    base('referrals')
        .select({
            view: 'Grid view',
            filterByFormula: `AND(${formula})`
        })
        .eachPage(
            function page(records, fetchNextPage) {
                records.forEach(function(record) {
                    referrals.push(record.fields);
                });
                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    next(err);
                }
                res.locals.referrals = referrals;
                req.referrals = referrals;
                req.type = 'referrals';
                next();
            }
        );
};
