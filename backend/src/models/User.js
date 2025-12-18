const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: false // Optional for students/employees without email
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'staff', 'student', 'employee'],
        default: 'student'
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined to not be unique
    },
    employeeId: {
        type: String,
        unique: true,
        sparse: true
    },
    department: {
        type: String,
        ref: 'Department'
    },
    class: {
        type: String // e.g., "10A"
    },
    faceDataRef: {
        type: String // Reference to face embedding/ID
    },
    qrCodeValue: {
        type: String,
        unique: true,
        sparse: true
    },
    rfidTagId: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
