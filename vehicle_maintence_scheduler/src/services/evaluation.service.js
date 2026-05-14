const axios = require('axios');
const config = require('../config');

class EvaluationService {
    constructor() {
        this.http = axios.create({
            baseURL: config.api.baseUrl,
            timeout: 10000
        });

        this.http.interceptors.request.use(async (req) => {
            const token = await require('./auth.service').getAccessToken();
            req.headers.Authorization = `Bearer ${token}`;
            return req;
        });
    }

    async getDepots() {
        const res = await this.http.get('/depots');
        const data = Array.isArray(res.data) ? res.data : [];
        return data.map(d => ({
            id: d.depotId,
            name: d.depotName || 'Unknown',
            location: d.location || 'Unknown',
            mechanicHours: d.capacity || 0,
            vehicleIds: d.vehicles || []
        }));
    }

    async getVehicles() {
        const res = await this.http.get('/vehicles');
        const data = Array.isArray(res.data) ? res.data : [];
        return data.map(v => ({
            vehicleId: v.vehicleId,
            type: v.type || 'Unknown',
            model: v.model || 'Unknown',
            status: v.status || 'Unknown'
        }));
    }

    async getTasks() {
        const res = await this.http.get('/tasks');
        const data = Array.isArray(res.data) ? res.data : [];
        return data.map(t => ({
            taskId: t.taskId,
            vehicleId: t.vehicleId,
            duration: t.duration || 0,
            impact: t.impact || 0
        }));
    }

    async getAggregatedDepots(filters = {}) {
        const [depots, vehicles] = await Promise.all([this.getDepots(), this.getVehicles()]);
        let data = depots.map(d => ({
            ...d,
            vehicles: vehicles.filter(v => d.vehicleIds.includes(v.vehicleId))
        }));

        if (filters.location) data = data.filter(d => d.location === filters.location);
        if (filters.type) data = data.map(d => ({ ...d, vehicles: d.vehicles.filter(v => v.type === filters.type) }));
        if (filters.status) data = data.map(d => ({ ...d, vehicles: d.vehicles.filter(v => v.status === filters.status) }));

        return data;
    }
}

module.exports = new EvaluationService();
