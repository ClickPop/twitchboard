module.exports = function(req, res, next) {
    req.data = {
        links: {
            self: req.baseURL
        },
        data: {
            type: req.type,
            channel: req.query.channel,
            referrals: req.referrals,
            leaderboard: req.leaderboard,
            settings: req.leaderboardSettings
        }
    };
    next();
};
