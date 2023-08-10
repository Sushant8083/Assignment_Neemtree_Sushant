const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    mobile: Number,
    dateOfBirth: String,
    workExperience: String,
    resumeTitle: String,
    currentLocation: String,
    postalAddress: String,
    currentEmployer: String,
    currentDesignation: String
});

const User = mongoose.model('Students', userSchema);

module.exports = User;
