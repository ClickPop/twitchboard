function addOrIncrementReferrer(referral, leaderboard) {
	var found = false;
	if (leaderboard.length > 0) {
		for (var i = 0; i < leaderboard.length; i++) {
			if (leaderboard[i].referrer === referral.referrer) {
				leaderboard[i].views++;
				found = true;
			}
		}
	}
	if (!found) {
		leaderboard.push({ referrer: referral.referrer, views: 1 });
	}

	return leaderboard;
}

module.exports = function(req, res, next) {
	var referrals =
		typeof req.referrals != undefined ? req.referrals : res.locals.referrals;
	var settings = res.locals.leaderboardSettings;

	leaderboard = [];

	referrals.forEach(referral => {
		leaderboard = addOrIncrementReferrer(referral, leaderboard);
	});

	leaderboard.sort((a, b) => (a.views < b.views ? 1 : -1));

	req.leaderboard = leaderboard;
	res.locals.leaderboard = leaderboard;
	next();
};
