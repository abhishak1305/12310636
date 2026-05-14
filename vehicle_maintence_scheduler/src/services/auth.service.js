const axios = require('axios');
const config = require('../config');

class AuthService {
    constructor() {
        this.token = null;
        this.expiry = null;
    }

    async getAccessToken() {
        if (this.token && this.expiry && Date.now() < this.expiry) return this.token;

        try {
            const res = await axios.post(`${config.api.baseUrl}/auth`, {
                email: config.api.email,
                name: config.api.name,
                rollNo: config.api.rollNo,
                accessCode: config.api.accessCode,
                clientID: config.api.clientId,
                clientSecret: config.api.clientSecret
            });

            this.token = res.data.access_token;
            const ttl = res.data.expires_in || 3600;
            this.expiry = Date.now() + (ttl * 1000) - 60000; 

            return this.token;
        } catch (err) {
            console.error('Auth Error:', err.response?.data || err.message);
            throw err;
        }
    }
}

module.exports = new AuthService();
