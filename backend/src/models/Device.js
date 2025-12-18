const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['camera', 'qr-scanner', 'rfid-reader', 'mobile', 'other'],
        required: true
    },
    location: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    apiKey: {
        type: String,
        select: false // Hide by default
    },
    lastPing: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Device', DeviceSchema);
