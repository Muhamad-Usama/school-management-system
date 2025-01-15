const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    schoolId: {type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true},
    capacity: {type: Number, required: true},
    resources: [{
        type: {type: String, required: true}, quantity: {type: Number, required: true}
    }],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Classroom', ClassroomSchema);
