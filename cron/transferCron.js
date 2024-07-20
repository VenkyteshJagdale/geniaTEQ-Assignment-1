const cron = require('node-cron');
const axios = require('axios');

//Shedule Cron After Every One Min.
cron.schedule('* * * * *', async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/payment/transferFunds');
        console.log(response.data);
    } catch (error) {
        console.error('Error transferring funds:', error);
    }
});
