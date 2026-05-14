const queueService = require('../services/queue.service');

let notifications = [
    {
        notificationId: "N1",
        studentId: "S1",
        subject: "Placement Opportunity: Google",
        message: "A new placement drive has been scheduled for your batch.",
        status: "Sent",
        category: "placement",
        isRead: false,
        timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
        notificationId: "N2",
        studentId: "S1",
        subject: "Exam Result Declared",
        message: "Your Semester 6 results are now available on the portal.",
        status: "Sent",
        category: "result",
        isRead: false,
        timestamp: new Date(Date.now() - 1800000).toISOString()
    }
];

const PRIORITIES = { placement: 3, result: 2, event: 1, default: 0 };
let clients = [];

class NotificationController {
    async getAllNotifications(req, res) {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const sorted = [...notifications].sort((a, b) => {
            if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
            const pA = PRIORITIES[a.category] || 0;
            const pB = PRIORITIES[b.category] || 0;
            if (pA !== pB) return pB - pA;
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        res.status(200).json({
            success: true,
            count: notifications.length,
            limit,
            offset,
            data: sorted.slice(offset, offset + limit)
        });
    }

    async sendNotification(req, res) {
        const { studentId, subject, message, category } = req.body;
        if (!studentId || !message) return res.status(400).json({ success: false });

        const n = {
            notificationId: `N${notifications.length + 1}`,
            studentId,
            subject: subject || "No Subject",
            message,
            category: category || "default",
            status: "Sent",
            isRead: false,
            timestamp: new Date().toISOString()
        };

        notifications.push(n);
        clients.forEach(c => c.write(`data: ${JSON.stringify(n)}\n\n`));

        res.status(201).json({ success: true, data: n });
    }

    async markAsRead(req, res) {
        const n = notifications.find(x => x.notificationId === req.params.id);
        if (!n) return res.status(404).json({ success: false });

        n.isRead = true;
        res.status(200).json({ success: true, data: n });
    }

    async bulkSend(req, res) {
        const { recipients, message } = req.body;
        if (!Array.isArray(recipients) || recipients.length === 0 || !message) {
            return res.status(400).json({ success: false });
        }

        const result = await queueService.addBulkJob(message, recipients);
        res.status(202).json({ success: true, meta: result });
    }

    async streamNotifications(req, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const heartBeat = setInterval(() => res.write(': keep-alive\n\n'), 30000);
        clients.push(res);

        req.on('close', () => {
            clearInterval(heartBeat);
            clients = clients.filter(c => c !== res);
        });
    }

    async getNotificationById(req, res) {
        const n = notifications.find(x => x.notificationId === req.params.id);
        if (!n) return res.status(404).json({ success: false });
        res.status(200).json({ success: true, data: n });
    }
}

module.exports = new NotificationController();
