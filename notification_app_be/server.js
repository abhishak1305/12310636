require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./src/middleware/logger.middleware');
const routes = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/', routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Notification System running on port ${PORT}`);
});
