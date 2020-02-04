const passport = require('passport');

module.exports = function (req, res, next) {
    if (req.user != undefined) {
        if(req.user.fields.display_name === req.params.channel) {
            next();
        } else {
            res.status(401).send('Unauthorized access');
        }
    } else {
        res.redirect('/');
    }
}