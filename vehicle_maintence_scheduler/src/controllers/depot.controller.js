const evaluationService = require('../services/evaluation.service');

class DepotController {
    async getDepots(req, res, next) {
        try {
            const { location, type, status } = req.query;
            const data = await evaluationService.getAggregatedDepots({ location, type, status });
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new DepotController();
