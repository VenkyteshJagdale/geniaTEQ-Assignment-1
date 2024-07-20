const User = require("../models/userModel");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//Send OTP.
let sendOtp = async (req, res) => {
  const { phone_number } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    await client.messages
      .create({
        body: `Your OTP is ${otp}`,
        from: "+12295972980",
        to: phone_number,
      })
      .then((message) => console.log("this is the final message", message.sid));

    let user = await User.findOne({ phone_number });
    if (!user) {
      user = new User({ phone_number, otp });
    } else {
      user.otp = otp;
    }
    await user.save();
    res.status(200).json({ 
      message: "OTP sent successfully" ,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to send OTP", error 
    });
  }
};

//Verify OTP.
let verifyOtp = async (req, res) => {
  const { phone_number, otp } = req.body;
  try {
    const user = await User.findOne({ phone_number, otp });
    if (user) {
      const token = jwt.sign({ phone_number }, process.env.JWT_SECRET);
      user.token = token;
      await user.save();
      res.status(200).json({ token });
    } else {
      res.status(400).json({ 
        message: "Invalid OTP" 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: "Verification failed", error 
    });
  }
};
//Exported methods.
module.exports = { sendOtp, verifyOtp };
