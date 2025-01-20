const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true, minlength: 3, maxlength: 50},
    email: {
        type: String, required: true, unique: true, lowercase: true, trim: true,
    },
    password: {type: String, required: true, minlength: 8},
    role: {
        type: String, enum: ["Superadmin", "Administrator", "Student"], required: true, default: "Student",
    },
    active: {type: Boolean, default: true},
    invalidLoginAttempts: {type: Number, default: 0},
    lockLogin: {type: Date, default: null},
    id: {type: String},
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;