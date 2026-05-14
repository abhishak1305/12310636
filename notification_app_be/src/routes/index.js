const express = require('express');
const router = express.Router();
const notificationRoutes = require('./notification.routes');

router.use('/notifications', notificationRoutes);

module.exports = router;
