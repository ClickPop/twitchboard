const express = require('express');
const app = express();
const airtable = require('airtable');
const bcrypt = require('bcrypt');
const request = require('request');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

app.get('/', (req, res) => res.send('API Running'));

app.get('/:channel_id/:referrer_id', async (req, res) => {
    try {
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
                        console.log(record.getId(), Date(Date.now));
                    });
                }
            );

            res.json(tableData);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('An error occurred');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
