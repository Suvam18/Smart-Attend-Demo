const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date, // Normalized date (e.g., set time to 00:00:00)
        required: true
    },
    checkInTime: {
        type: Date,
        required: true
    },
    checkOutTime: {
        type: Date
    },
    mode: {
        type: String,
        enum: ['face', 'qr', 'rfid', 'manual'],
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'late', 'absent', 'on-leave'],
        default: 'present'
    },
    deviceId: {
        type: String
    },
    rawData: {
        type: Schema.Types.Mixed // Store any extra data from sensor
    }
}, { timestamps: true });

// Prevent multiple check-ins for same user on same day (if desired, or handle in logic)
// AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
