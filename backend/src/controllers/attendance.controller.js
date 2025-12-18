const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Mark attendance
// @route   POST /api/attendance/mark
// @access  Public (for devices) or Private
exports.markAttendance = async (req, res) => {
    try {
        const { userId, mode, deviceId, qrCodeValue, rfidTagId, faceDataRef } = req.body;

        let user;

        // Identify user based on mode
        if (userId) {
            user = await User.findById(userId);
        } else if (mode === 'qr' && qrCodeValue) {
            user = await User.findOne({ qrCodeValue });
        } else if (mode === 'rfid' && rfidTagId) {
            user = await User.findOne({ rfidTagId });
        } else if (mode === 'face' && faceDataRef) {
            user = await User.findOne({ faceDataRef });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check for existing attendance today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingRecord = await Attendance.findOne({
            user: user._id,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (existingRecord) {
            return res.status(200).json({
                success: true,
                message: 'Attendance already marked for today',
                data: existingRecord
            });
        }

        // Determine status (Simple logic: Late after 9:30 AM)
        const now = new Date();
        const lateThreshold = new Date();
        lateThreshold.setHours(9, 30, 0, 0); // 9:30 AM

        const status = now > lateThreshold ? 'late' : 'present';

        const attendance = await Attendance.create({
            user: user._id,
            date: startOfDay, // Normalize date
            checkInTime: now,
            mode,
            status,
            deviceId
        });

        res.status(201).json({
            success: true,
            data: attendance,
            user: {
                name: user.name,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get today's attendance
// @route   GET /api/attendance/today
// @access  Private
exports.getTodayAttendance = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await Attendance.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })
            .populate('user', 'name role department userId')
            .sort({ checkInTime: -1 });

        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get attendance summary stats (Today)
// @route   GET /api/attendance/summary
// @access  Private
exports.getSummary = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const totalUsers = await User.countDocuments({ status: 'active' });

        const presentCount = await Attendance.countDocuments({
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['present', 'late'] }
        });

        const lateCount = await Attendance.countDocuments({
            date: { $gte: startOfDay, $lte: endOfDay },
            status: 'late'
        });

        const absentCount = totalUsers - presentCount;

        res.status(200).json({
            success: true,
            data: {
                totalMembers: totalUsers,
                present: presentCount,
                absent: absentCount > 0 ? absentCount : 0,
                late: lateCount
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
