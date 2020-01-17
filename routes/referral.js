var express = require('express');
var router = express.Router();

const useReferral = require('../middleware/useReferral');
const requestIP = require('../middleware/requestIP');

router.get('/:channel/:referrer', requestIP, useReferral);

module.exports = router;
