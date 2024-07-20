const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({

    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    merchantShare: { 
        type: Number 
    },
    userShare: { 
        type: Number 
    },
    commission: { 
        type: Number 
    },
    userData: { 
        type: Object 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed'], 
        default: 'pending' 
    },
});

module.exports = mongoose.model('Payment', paymentSchema);
