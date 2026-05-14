const env = process.env;
const required = ['CLIENT_ID', 'CLIENT_SECRET', 'EMAIL', 'ROLL_NO', 'ACCESS_CODE', 'API_BASE_URL'];

required.forEach(key => {
    if (!env[key]) {
        console.error(`Missing: ${key}`);
        process.exit(1);
    }
});

module.exports = {
    port: env.PORT || 3000,
    env: env.NODE_ENV || 'development',
    api: {
        baseUrl: env.API_BASE_URL,
        clientId: env.CLIENT_ID,
        clientSecret: env.CLIENT_SECRET,
        email: env.EMAIL,
        name: env.NAME,
        rollNo: env.ROLL_NO,
        accessCode: env.ACCESS_CODE
    }
};
