// Woking On It 
const request = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const User = require('../models/userModel'); 
const Payment = require('../models/paymentModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('API Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Payment.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Login with OTP API', () => {
        it('should send OTP successfully', async () => {
            const response = await request(app)
                .post('/api/auth/send_otp')
                .send({ phone_number: '+18777804236' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'OTP sent successfully');
        });

        it('should return token on successful OTP verification', async () => {
            await request(app)
                .post('/api/auth/send_otp')
                .send({ phone_number: '+18777804236' });

            const response = await request(app)
                .post('/api/auth/verify_otp')
                .send({ phone_number: '+18777804236', otp: '975156' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });
    });

    describe('Payment API', () => {
        it('should process payment and allocate shares', async () => {
            const token = jwt.sign({ phoneNumber: '+18777804236' }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const response = await request(app)
                .post('/api/payment/processPayment')
                .send({
                    token,
                    amount: 5000,
                    user_data: {
                        name: 'Venky',
                        email: 'venky@example.com'
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Payment processed successfully');

            const payment = await Payment.findOne({ userId: (await User.findOne({ phoneNumber: '+18777804236' }))._id });
            expect(payment).toBeDefined();
            expect(payment.amount).toBe(5000);
        });
    });

    describe('Transfer Funds API', () => {
        it('should transfer funds and update payment status', async () => {
            const user = new User({ phoneNumber: '+18777804236' });
            await user.save();
            const payment = new Payment({
                userId: user._id,
                amount: 5000,
                merchantShare: 3500,
                userShare: 1000,
                commission: 500,
                status: 'pending',
            });
            await payment.save();

            const response = await request(app)
                .post('/api/payment/transferFunds')
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Funds transferred successfully');

            const updatedPayment = await Payment.findById(payment._id);
            expect(updatedPayment.status).toBe('completed');
        });
    });
});
