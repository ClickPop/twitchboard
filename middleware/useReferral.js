const bcrypt = require('bcrypt');
const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

module.exports = async function(req, res, next) {
    // A bit of destructuring and variable naming then creating the hash
    const { channel, referrer } = req.params;
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
            referrer: referrer,
            channel: channel,
            'ip-address': JSON.stringify(ipAddr)
                .split('"')
                .join(''),
            platform: 'twitch',
            'data-hash': hash,
            'user-agent': useragent
        };

        await base('referrals').create(
            [
                {
                    fields: tableData
                }
            ],
            function(err, records) {
                if (err) {
                    next(err);
                }

                res.redirect(`https://twitch.tv/${channel}`);
            }
        );
    }
};
