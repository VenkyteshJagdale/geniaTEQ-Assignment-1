const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const PORT = process.env.PORT || 3000;

//Cron Shedular
require('./cron/transferCron');

//Middleware
app.use(bodyParser.json());

//MongoDB Connection.
connectDB();

//Route Setup
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

//Server Running On Port 3000.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;