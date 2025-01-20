const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/},
    dateOfBirth: {type: Date, required: true},
    schoolId: {type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true},
    classroomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Classroom'},
    enrollmentDate: {type: Date, default: Date.now},
    profilePicture: {type: String}, // Optional field for profile picture URL
    guardianDetails: {
        name: {type: String}, contact: {type: String, match: /^\+?[1-9]\d{1,14}$/}, // Optional field for guardian contact
        relationship: {type: String}
    },
    transferHistory: [{
        fromClassroomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Classroom'},
        toClassroomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Classroom'},
        transferDate: {type: Date},
        reason: {type: String}, // Optional field for transfer reason
        notes: {type: String} // Optional field for additional context
    }],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Student', StudentSchema);

