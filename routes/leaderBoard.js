var express = require('express');
var router = express.Router();

const processLeaderboard = require('../middleware/processLeaderboard');
const getLeaderboardSettings = require('../middleware/getLeaderboardSettings');
const getReferrals = require('../middleware/getReferrals');

router.get(
	'/:channel',
	getLeaderboardSettings,
	getReferrals,
	processLeaderboard,
	(req, res) => {
		res.render('index');
	}
);

module.exports = router;
