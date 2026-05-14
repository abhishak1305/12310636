const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

router.get('/', notificationController.getAllNotifications);
router.get('/stream', notificationController.streamNotifications);
router.post('/send', notificationController.sendNotification);
router.post('/bulk', notificationController.bulkSend);
router.get('/:id', notificationController.getNotificationById);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
