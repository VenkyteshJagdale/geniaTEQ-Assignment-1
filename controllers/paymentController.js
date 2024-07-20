const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Payment = require("../models/paymentModel");

//Make Payment and ste status Pending.
let processPayment = async (req, res) => {
  console.log(req.body);
  const { token, amount, userData } = req.body;
  console.log("User Data:", userData);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ phoneNumber: decoded.phoneNumber });
    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const payment = new Payment({
      userId: user._id,
      amount,
      userData,
      status: "pending",
    });

    await payment.save();
    res.status(200).json({
      message: "Payment processed successfully",
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment processing failed",
      error,
    });
  }
};

//Transfer fund to merchantShare, userShare, commission.
let transferFunds = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "pending" });

    await Promise.all(
      payments.map(async (payment) => {
        const merchantShare = payment.amount * 0.7;
        const userShare = payment.amount * 0.2;
        const commission = payment.amount * 0.1;

        payment.merchantShare = merchantShare;
        payment.userShare = userShare;
        payment.commission = commission;
        payment.status = "completed";
        await payment.save();
      })
    );

    res.status(200).json({ 
      message: "Funds transferred successfully",
      data: payments
     });
  } catch (error) {
    console.error("Error transferring funds:", error);
    res.status(500).json({ message: "Fund transfer failed", error });
  }
};

//Exported methods.
module.exports = { processPayment, transferFunds };
