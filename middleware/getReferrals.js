const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.API_KEY;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base('appeqb1CAXVkBv8hN');

module.exports = function(req, res, next) {
	var referrals = [];
	const channel = req.params.channel_id;

	base('referrals')
		.select({
			view: 'Grid view',
			filterByFormula: `{channel} = "${channel}"`
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
				req.referrals = referrals;
				res.locals.referrals = referrals;
				next();
			}
		);
};
