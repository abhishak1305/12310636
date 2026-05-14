const express = require('express');
const router = express.Router();
const schedulingRoutes = require('./scheduling.routes');
const depotRoutes = require('./depot.routes');

router.use('/schedule', schedulingRoutes);
router.use('/depots', depotRoutes);

module.exports = router;
