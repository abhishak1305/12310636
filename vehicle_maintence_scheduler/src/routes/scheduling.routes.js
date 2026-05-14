const express = require('express');
const router = express.Router();
const schedulingController = require('../controllers/scheduling.controller');

router.get('/', schedulingController.getOptimalSchedule);

module.exports = router;
