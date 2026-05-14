const fs = require('fs');
const path = require('path');

class QueueService {
    constructor() {
        this.jobs = [];
        this.running = false;
        this.batch = 100;
    }

    async addBulkJob(msg, users) {
        for (let i = 0; i < users.length; i += this.batch) {
            this.jobs.push({
                id: `J_${Date.now()}_${i}`,
                msg,
                users: users.slice(i, i + this.batch),
                tries: 0
            });
        }
        if (!this.running) this.work();
        return { count: Math.ceil(users.length / this.batch) };
    }

    async work() {
        this.running = true;
        while (this.jobs.length > 0) {
            const job = this.jobs.shift();
            try {
                await this.send(job);
            } catch (e) {
                if (job.tries < 3) {
                    job.tries++;
                    this.jobs.push(job);
                } else {
                    this.log(job, e.message);
                }
            }
            await new Promise(r => setTimeout(r, 100));
        }
        this.running = false;
    }

    async send(job) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() < 0.05 ? reject(new Error("Timeout")) : resolve();
            }, 500);
        });
    }

    log(job, err) {
        const dir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        fs.appendFileSync(path.join(dir, 'errors.log'), `[${new Date().toISOString()}] ${job.id}: ${err}\n`);
    }
}

module.exports = new QueueService();
