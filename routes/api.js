var express = require('express');
var router = express.Router();
const { query, validationResult } = require('express-validator');

// const processLeaderboard = require('../middleware/processLeaderboard');
// const getLeaderboardSettings = require('../middleware/getLeaderboardSettings');
// const getReferrals = require('../middleware/getReferrals');
// const buildJSON = require('../middleware/buildJSON');

const {
    processLeaderboard,
    getLeaderboardSettings,
    getReferrals,
    buildJSON
} = require('../middleware/middleware');

router.get(
    '/v1/getReferrals',
    [
        query('channel')
            .exists()
            .withMessage('Please specify a channel')
            .custom(channel => {
                if (channel != undefined && channel.search(/[^a-zA-Z_]/) > -1) {
                    throw new Error('Channel contains invalid characters');
                } else {
                    return true;
                }
            })
            .trim()
            .escape(),
        query('referrer')
            .optional()
            .trim()
            .escape(),
        query('since')
            .optional()
            .isISO8601()
    ],
    getReferrals,
    buildJSON,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        res.json(req.data);
    }
);

router.get(
    '/v1/getLeaderboard',
    [
        query('channel')
            .exists()
            .withMessage('Please specify a channel')
            .custom(channel => {
                if (channel != undefined && channel.search(/[^a-z_]/) > -1) {
                    throw new Error('Channel contains invalid characters');
                } else {
                    return true;
                }
            })
            .trim()
            .escape(),
        query('referrer')
            .optional()
            .trim()
            .escape(),
        query('since')
            .optional()
            .isISO8601()
    ],
    getReferrals,
    getLeaderboardSettings,
    processLeaderboard,
    buildJSON,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        res.json(req.data);
    }
);

module.exports = router;
