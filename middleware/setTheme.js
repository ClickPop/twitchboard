const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

module.exports = async function(req, res) {
    const settingsID = res.locals.leaderboardSettings.id;
    const theme = req.params.theme;
    var data = { success: false, message: 'Unknown error'};
    var status = 500;

    res.setHeader('Content-Type', 'application/json');
    
    if (typeof theme === 'string' && theme.length > 0) {
        await base('leaderboards').update([
            {
                "id": settingsID,
                "fields": {theme: theme}
            }
        ], function(err, records) {
            if (err) {
                data = {success: false, error: err, message: 'Error' };
                res.status(status).send(JSON.stringify(data));
            }
            records.forEach(function(record) {
                console.log('Updated theme', record.get('channel'), record.get('theme'));
            });
            data = {success: true};
            status = 201;
            res.status(status).send(JSON.stringify(data));
        });
    } else {
        data = {success: false, message: 'Invalid theme value'};
        res.status(status).send(JSON.stringify(data));
    }


};
