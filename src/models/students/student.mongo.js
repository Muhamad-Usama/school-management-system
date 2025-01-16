const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
    enrollmentDate: { type: Date, default: Date.now },
    transferHistory: [
        {
            fromClassroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
            toClassroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
            transferDate: { type: Date }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
