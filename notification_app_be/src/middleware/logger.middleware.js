const logger = (req, res, next) => {
    const t0 = Date.now();
    res.on('finish', () => {
        const dt = Date.now() - t0;
        const msg = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} - ${dt}ms`;
        
        if (res.statusCode >= 500) console.error(`\x1b[31m${msg}\x1b[0m`);
        else if (res.statusCode >= 400) console.warn(`\x1b[33m${msg}\x1b[0m`);
        else console.log(`\x1b[32m${msg}\x1b[0m`);
    });
    next();
};

module.exports = logger;
