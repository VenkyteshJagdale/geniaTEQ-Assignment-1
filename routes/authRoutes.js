const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/authController');
const router = express.Router();

// Send And Verify OTP Routes.
router.post('/send_otp', sendOtp);
router.post('/verify_otp', verifyOtp);

module.exports = router;
