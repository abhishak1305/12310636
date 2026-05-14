const express = require('express');
const router = express.Router();
const depotController = require('../controllers/depot.controller');

router.get('/', depotController.getDepots);

module.exports = router;
