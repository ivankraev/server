const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    profilePic: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
}, { timestamps: true })


module.exports = mongoose.model('User', userSchema);