const bcrypt = require('bcrypt');
const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

module.exports = async function(req, res, next) {
    // A bit of destructuring and variable naming then creating the hash
    const { channel_id, referrer_id } = req.params;
    const useragent = req.headers['user-agent'];
    const ipv4 = req.connection.remoteAddress.replace(/^.*:/, '');
    const ipv6 = req.connection.remoteAddress.replace(ipv4, '');
    const ipAddr = {
        ipv6,
        ipv4
    };
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(useragent + ipAddr, salt);

    //Compare the hash then add it to the database
    if (bcrypt.compare(useragent + ipAddr, hash)) {
        const tableData = {
            referrer: referrer_id,
            channel: channel_id,
            'ip-address': JSON.stringify(ipAddr, null, 2)
                .split('"')
                .join(''),
            platform: 'twitch',
            'data-hash': hash,
            'user-agent': useragent
        };

        // var referral = [];

        await base('referrals').create(
            [
                {
                    fields: tableData
                }
            ],
            function(err, records) {
                if (err) {
                    console.error(err);
                    return;
                }
                records.forEach(function(record) {
                    // console.log(record.id, record.fields);
                    referral = Object.entries(record.fields);
                    referral.unshift(['id', record.id]);
                    res.locals.result = referral.map(key =>
                        JSON.stringify(key)
                    );
                    next();
                });
            }
        );
    }
};
