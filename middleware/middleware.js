const excludeFavicon = require('./exludeFavicon');
const processLeaderboard = require('./processLeaderboard');
const setTheme = require('./setTheme');
const resetLeaderboard = require('./resetLeaderboard');
const getLeaderboardSettings = require('./getLeaderboardSettings');
const getReferrals = require('./getReferrals');
const useReferral = require('./useReferral');
const requestIP = require('./requestIP');
const buildJSON = require('./buildJSON');
const auth = require('./auth');

module.exports = {
    auth,
    excludeFavicon,
    processLeaderboard,
    setTheme,
    resetLeaderboard,
    getLeaderboardSettings,
    getReferrals,
    useReferral,
    requestIP,
    buildJSON
};
