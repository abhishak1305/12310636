const evaluationService = require('../services/evaluation.service');
const schedulingService = require('../services/scheduling.service');
const fs = require('fs');
const path = require('path');

class SchedulingController {
    async getOptimalSchedule(req, res, next) {
        try {
            const depots = await evaluationService.getDepots();
            if (!depots || depots.length === 0) return res.status(404).json({ message: "No depots available" });

            const depot = depots[0];
            const tasks = await evaluationService.getTasks();
            const depotTasks = tasks.filter(t => depot.vehicleIds.includes(t.vehicleId));

            const schedule = schedulingService.solve(depotTasks, depot.mechanicHours);

            const out = {
                selectedTasks: schedule.selected,
                totalDuration: schedule.used,
                totalImpact: schedule.totalImpact,
                remainingHours: schedule.remaining,
                depot: { id: depot.id, name: depot.name, capacity: depot.mechanicHours }
            };

            const dir = path.join(process.cwd(), 'output');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            fs.writeFileSync(path.join(dir, 'output.json'), JSON.stringify(out, null, 2));

            res.status(200).json(out);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new SchedulingController();
