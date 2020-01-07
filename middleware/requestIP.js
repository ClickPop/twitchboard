const requestIp = require('request-ip');

module.exports = function(req, res, next) {
    const tempIP = requestIp.getClientIp(req);
    var clientIP = {
        ipv4: null,
        ipv6: null
    };

    console.log(tempIP);
    if (tempIP === "::1" || tempIP === "::ffff:127.0.0.1") {
        clientIP.ipv4 = "127.0.0.1";
        clientIP.ipv6 = "::1";

        console.log(clientIP);
    }

    next();
};
