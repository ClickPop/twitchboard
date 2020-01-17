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
    var referrals = req.referrals;
    var settings = req.leaderboardSettings;

    leaderboard = [];

    referrals.forEach(referral => {
        leaderboard = addOrIncrementReferrer(referral, leaderboard);
    });

    leaderboard.sort((a, b) => (a.views < b.views ? 1 : -1));

    if (leaderboard.length > 10) {
        leaderboard = leaderboard.slice(0, 9);
    }

    res.locals.leaderboard = leaderboard;
    req.leaderboard = leaderboard;
    next();
};
