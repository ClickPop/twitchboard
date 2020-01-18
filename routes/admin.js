var express = require('express');
var router = express.Router();

// const processLeaderboard = require('../middleware/processLeaderboard');
// const setTheme = require('../middleware/setTheme');
// const resetLeaderboard = require('../middleware/resetLeaderboard');
// const getLeaderboardSettings = require('../middleware/getLeaderboardSettings');
// const getReferrals = require('../middleware/getReferrals');

const {
    processLeaderboard,
    setTheme,
    resetLeaderboard,
    getLeaderboardSettings,
    getReferrals
} = require('../middleware/middleware');

router.get(
    '/:channel',
    getLeaderboardSettings,
    getReferrals,
    processLeaderboard,
    (req, res) => {
        res.render('admin');
    }
);
router.get('/:channel/reset', getLeaderboardSettings, resetLeaderboard);
router.post('/:channel/set-theme/:theme', getLeaderboardSettings, setTheme);
router.get('/', (req, res) => {
    res.send('Thou shalt not pass!');
});

module.exports = router;
